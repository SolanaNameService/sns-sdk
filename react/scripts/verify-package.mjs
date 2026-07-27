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
for (const target of exportTargets) {
  assert(
    await exists(path.resolve(packageRoot, target)),
    `Missing package export target: ${target}`,
  );
}

const declarationFiles = (await walk(path.join(packageRoot, "dist"))).filter(
  (file) => file.endsWith(".d.ts"),
);
assert.equal(
  declarationFiles.length,
  1,
  "Expected one bundled declaration file",
);
const declarationContent = await readFile(declarationFiles[0], "utf8");
assert(
  !/\b(?:from|import)\s*\(?["']\./.test(declarationContent),
  "Bundled declarations contain a relative ESM import",
);
assert(
  !(await exists(path.join(packageRoot, "dist/types-internal"))),
  "Temporary declaration files were not removed",
);

const temporaryRoot = await mkdtemp(path.join(tmpdir(), "sns-react-package-"));
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
  for (const requiredFile of [
    "CHANGELOG.md",
    "LICENSE.md",
    "README.md",
    "package.json",
  ]) {
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
        name: "sns-react-package-consumer",
        private: true,
        type: "module",
        dependencies: {
          "@bonfida/sns-react": fileDependency(
            path.join(temporaryRoot, packResult.filename),
          ),
          "@bonfida/spl-name-service": fileDependency(
            path.resolve(packageRoot, "../js"),
          ),
          "@solana/web3.js": packageJson.peerDependencies["@solana/web3.js"],
          "@tanstack/react-query":
            packageJson.peerDependencies["@tanstack/react-query"],
          "@types/react": packageJson.devDependencies["@types/react"],
          react: "18.3.1",
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
    [
      npmCli,
      "install",
      "--ignore-scripts",
      "--legacy-peer-deps",
      "--no-audit",
      "--no-fund",
    ],
    {
      cwd: consumerRoot,
      stdio: "inherit",
    },
  );

  const expectedExports = [
    "useResolve",
    "useSafeResolve",
    "usePrimaryDomain",
    "useProfilePic",
    "useRecords",
    "useReverseLookup",
    "useSnsDomainsForOwner",
    "useSubdomains",
  ];
  const runtimeAssertion = `
    const expected = ${JSON.stringify(expectedExports)};
    const actual = MODULE;
    for (const name of expected) {
      if (typeof actual[name] !== "function") throw new Error("Missing export: " + name);
    }
  `;
  execFileSync(
    process.execPath,
    ["-e", runtimeAssertion.replace("MODULE", 'require("@bonfida/sns-react")')],
    { cwd: consumerRoot, stdio: "inherit" },
  );
  execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `import * as packageModule from "@bonfida/sns-react";${runtimeAssertion.replace("MODULE", "packageModule")}`,
    ],
    { cwd: consumerRoot, stdio: "inherit" },
  );

  const tsc = require.resolve("typescript/bin/tsc");
  for (const config of ["tsconfig.bundler.json", "tsconfig.nodenext.json"]) {
    execFileSync(process.execPath, [tsc, "-p", config], {
      cwd: consumerRoot,
      stdio: "inherit",
    });
  }

  console.log("Verified packed CJS, ESM, Bundler types, and NodeNext types.");
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
