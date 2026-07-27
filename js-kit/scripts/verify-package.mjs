import { execFileSync } from "node:child_process";
import { access, readFile, readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const packageJson = JSON.parse(
  await readFile(path.join(packageRoot, "package.json"), "utf8")
);

const representativeExports = new Map([
  [".", ["resolve", "safeResolve"]],
  ["./address", "getPrimaryDomain"],
  ["./bindings", "registerDomain"],
  ["./codecs", "addressCodec"],
  ["./constants", "NAME_PROGRAM_ADDRESS"],
  ["./domain", ["resolve", "safeResolve"]],
  ["./errors", "SNSError"],
  ["./instructions", "TransferInstruction"],
  ["./nft", "getSnsNftMint"],
  ["./record", "getRecordV1Address"],
  ["./states", "RegistryState"],
  ["./types", "Record"],
  ["./utils", "serializeRecordContent"],
]);

const getExportTargets = (value) => {
  if (typeof value === "string") return [value];
  return Object.values(value).flatMap(getExportTargets);
};

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(entryPath) : entryPath;
    })
  );
  return files.flat();
};

const exists = async (target) => {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const packageSubpaths = new Set(Object.keys(packageJson.exports));
const testedSubpaths = new Set(representativeExports.keys());
const missingRuntimeChecks = [...packageSubpaths].filter(
  (subpath) => !testedSubpaths.has(subpath)
);
const staleRuntimeChecks = [...testedSubpaths].filter(
  (subpath) => !packageSubpaths.has(subpath)
);

assert(
  missingRuntimeChecks.length === 0,
  `Exports missing runtime checks: ${missingRuntimeChecks.join(", ")}`
);
assert(
  staleRuntimeChecks.length === 0,
  `Runtime checks reference unknown exports: ${staleRuntimeChecks.join(", ")}`
);

const exportTargets = new Set(
  Object.values(packageJson.exports).flatMap(getExportTargets)
);

for (const target of exportTargets) {
  assert(
    await exists(path.resolve(packageRoot, target)),
    `Missing package export target: ${target}`
  );
}

const distPath = path.join(packageRoot, "dist");
const distFiles = await walk(distPath);
const relativeDistFiles = distFiles.map((file) =>
  path.relative(distPath, file).replaceAll(path.sep, "/")
);

const runtimeFiles = distFiles.filter(
  (file) => file.endsWith(".mjs") || file.endsWith(".cjs")
);
for (const runtimeFile of runtimeFiles) {
  const lines = (await readFile(runtimeFile, "utf8")).split(/\r?\n/);
  for (const line of lines) {
    assert(
      !/^\s*import\s+["'][^"']+["'];?\s*$/.test(line) &&
        !/^\s*require\(\s*["'][^"']+["']\s*\);?\s*$/.test(line),
      `Runtime file contains a side-effect-only module load: ${runtimeFile}: ${line.trim()}`
    );
  }
}

assert(
  !relativeDistFiles.some((file) => file.split("/").includes("node_modules")),
  "Published output contains a bundled node_modules tree"
);
assert(
  !(await exists(path.join(distPath, "types-internal"))),
  "Temporary declaration files were not removed"
);

const declarationFiles = relativeDistFiles.filter((file) =>
  file.endsWith(".d.ts")
);
const declarationTargets = [...exportTargets].filter((target) =>
  target.endsWith(".d.ts")
);
assert(
  declarationFiles.length === declarationTargets.length,
  `Expected ${declarationTargets.length} public declarations, found ${declarationFiles.length}`
);

for (const [
  subpath,
  representativeExportsForSubpath,
] of representativeExports) {
  const specifier =
    subpath === "."
      ? packageJson.name
      : `${packageJson.name}/${subpath.slice(2)}`;
  const esmModule = await import(specifier);
  const cjsModule = require(specifier);

  for (const representativeExport of Array.isArray(
    representativeExportsForSubpath
  )
    ? representativeExportsForSubpath
    : [representativeExportsForSubpath]) {
    assert(
      representativeExport in esmModule,
      `ESM entry ${specifier} is missing ${representativeExport}`
    );
    assert(
      representativeExport in cjsModule,
      `CommonJS entry ${specifier} is missing ${representativeExport}`
    );
  }
}

assert(process.env.npm_execpath, "npm_execpath is unavailable");
const packOutput = execFileSync(
  process.execPath,
  [process.env.npm_execpath, "pack", "--dry-run", "--ignore-scripts", "--json"],
  {
    cwd: packageRoot,
    encoding: "utf8",
  }
);
const [packResult] = JSON.parse(packOutput);
const packedFiles = new Set(packResult.files.map(({ path: file }) => file));

for (const target of exportTargets) {
  assert(
    packedFiles.has(target.replace(/^\.\//, "")),
    `Package tarball is missing export target: ${target}`
  );
}
for (const requiredFile of ["LICENSE", "README.md", "package.json"]) {
  assert(
    packedFiles.has(requiredFile),
    `Package tarball is missing ${requiredFile}`
  );
}

console.log(
  `Verified ${representativeExports.size} public entries and ${declarationFiles.length} declaration bundles.`
);
