import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const packageJson = JSON.parse(
  await readFile(path.join(packageRoot, "package.json"), "utf8"),
);
const npmCli = process.env.npm_execpath;

assert(npmCli, "npm_execpath is unavailable");

const exists = async (target) => {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
};

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(entryPath) : entryPath;
    }),
  );
  return nested.flat();
};

const getExportTargets = (value) =>
  typeof value === "string"
    ? [value]
    : Object.values(value).flatMap(getExportTargets);

const exportTargets = Object.values(packageJson.exports).flatMap(
  getExportTargets,
);
const declarationTargets = new Set(
  exportTargets.filter((target) => target.endsWith(".d.ts")),
);

for (const target of exportTargets) {
  assert(
    await exists(path.resolve(packageRoot, target)),
    `Missing package export target: ${target}`,
  );
}

const runtimeFiles = (
  await Promise.all(
    ["esm", "cjs"].map(async (format) =>
      (await walk(path.join(packageRoot, "dist", format))).filter((file) =>
        file.endsWith(`.${format === "esm" ? "mjs" : "cjs"}`),
      ),
    ),
  )
).flat();
for (const runtimeFile of runtimeFiles) {
  const lines = (await readFile(runtimeFile, "utf8")).split(/\r?\n/);
  for (const line of lines) {
    assert(
      !/^\s*import\s+["'][^"']+["'];?\s*$/.test(line) &&
        !/^\s*require\(\s*["'][^"']+["']\s*\);?\s*$/.test(line),
      `Runtime file contains a side-effect-only module load: ${runtimeFile}: ${line.trim()}`,
    );
  }
}

const declarationFiles = (await walk(path.join(packageRoot, "dist"))).filter(
  (file) => file.endsWith(".d.ts"),
);
assert.equal(
  declarationFiles.length,
  declarationTargets.size,
  "Unexpected declaration file count",
);
for (const declarationFile of declarationFiles) {
  const content = await readFile(declarationFile, "utf8");
  assert(
    !/\b(?:from|import)\s*\(?["']\./.test(content),
    `Declaration contains a relative internal import: ${declarationFile}`,
  );
}
assert(
  !(await exists(path.join(packageRoot, "dist/types-internal"))),
  "Temporary declaration files were not removed",
);

const runtimeChecks = {
  ".": ["getSnsDomainKeySync", "safeResolve"],
  "./address": "getPrimaryDomain",
  "./bindings": "burnDomain",
  "./constants": "NAME_PROGRAM_ID",
  "./domain": ["resolve", "safeResolve"],
  "./errors": "SNSError",
  "./instructions": "BurnInstruction",
  "./nft": "getDomainMint",
  "./record": "getMultipleRecords",
  "./states": "NameRegistryState",
  "./twitter": "getTwitterRegistryKey",
  "./types": "CustomBg",
  "./utils": "check",
};

const temporaryRoot = await mkdtemp(path.join(tmpdir(), "sns-js-package-"));
try {
  const packOutput = execFileSync(
    process.execPath,
    [
      npmCli,
      "pack",
      "--ignore-scripts",
      "--json",
      "--pack-destination",
      temporaryRoot,
    ],
    { cwd: packageRoot, encoding: "utf8" },
  );
  const [packResult] = JSON.parse(packOutput);
  const packedFiles = new Set(packResult.files.map(({ path: file }) => file));

  for (const target of exportTargets) {
    assert(
      packedFiles.has(target.replace(/^\.\//, "")),
      `Package tarball is missing export target: ${target}`,
    );
  }
  for (const requiredFile of ["LICENSE", "README.md", "package.json"]) {
    assert(
      packedFiles.has(requiredFile),
      `Package tarball is missing ${requiredFile}`,
    );
  }

  const consumerRoot = path.join(temporaryRoot, "consumer");
  await mkdir(consumerRoot, { recursive: true });
  const fileDependency = (target) => `file:${target.replaceAll("\\", "/")}`;
  await writeFile(
    path.join(consumerRoot, "package.json"),
    JSON.stringify(
      {
        name: "sns-js-package-consumer",
        private: true,
        type: "module",
        dependencies: {
          [packageJson.name]: fileDependency(
            path.join(temporaryRoot, packResult.filename),
          ),
          "@solana/web3.js": packageJson.peerDependencies["@solana/web3.js"],
        },
      },
      null,
      2,
    ),
  );

  for (const file of [
    "consumer.cts",
    "consumer.mts",
    "tsconfig.bundler.json",
    "tsconfig.nodenext.json",
  ]) {
    await writeFile(
      path.join(consumerRoot, file),
      await readFile(path.join(packageRoot, "tests/package", file)),
    );
  }

  execFileSync(
    process.execPath,
    [npmCli, "install", "--ignore-scripts", "--no-audit", "--no-fund"],
    { cwd: consumerRoot, stdio: "inherit" },
  );

  const cjsAssertion = Object.entries(runtimeChecks)
    .map(([subpath, exportNames]) => {
      const specifier = `${packageJson.name}${subpath === "." ? "" : subpath.slice(1)}`;
      return (Array.isArray(exportNames) ? exportNames : [exportNames])
        .map(
          (exportName) =>
            `if (!("${exportName}" in require("${specifier}"))) throw new Error("Missing ${specifier}:${exportName}");`,
        )
        .join("\n");
    })
    .join("\n");
  execFileSync(process.execPath, ["-e", cjsAssertion], {
    cwd: consumerRoot,
    stdio: "inherit",
  });

  const esmAssertion = Object.entries(runtimeChecks)
    .map(([subpath, exportNames], index) => {
      const specifier = `${packageJson.name}${subpath === "." ? "" : subpath.slice(1)}`;
      const assertions = (
        Array.isArray(exportNames) ? exportNames : [exportNames]
      )
        .map(
          (exportName) =>
            `if (!("${exportName}" in module${index})) throw new Error("Missing ${specifier}:${exportName}");`,
        )
        .join(" ");
      return `const module${index} = await import("${specifier}"); ${assertions}`;
    })
    .join("\n");
  execFileSync(process.execPath, ["--input-type=module", "-e", esmAssertion], {
    cwd: consumerRoot,
    stdio: "inherit",
  });

  const tsc = require.resolve("typescript/bin/tsc");
  for (const config of ["tsconfig.bundler.json", "tsconfig.nodenext.json"]) {
    execFileSync(process.execPath, [tsc, "-p", config], {
      cwd: consumerRoot,
      stdio: "inherit",
    });
  }

  console.log(
    "Verified packed root/subpath CJS, ESM, Bundler, and NodeNext consumers.",
  );
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
