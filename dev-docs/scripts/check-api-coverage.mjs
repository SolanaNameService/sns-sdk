import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveRustDeclaration } from "./rust-source-links.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDirectory, "../..");
const manifestPath = path.join(repoRoot, "dev-docs/api/api-coverage.json");
const products = new Set(["rust", "cli", "sdk-proxy"]);
const kinds = new Set([
  "rust-family",
  "rust-callable",
  "cli-command",
  "proxy-route",
]);
const proxyStatuses = new Set([
  "current",
  "alias",
  "deprecated",
  "root",
  "types",
]);
const errors = [];

const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);
const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;
const isRustIdentifier = (value) => /^[A-Za-z_]\w*$/.test(value);

function error(message) {
  errors.push(message);
}

function validatePath(value, label, entryId, prefix) {
  if (!isNonEmptyString(value)) {
    error(`${entryId}: ${label} must be a non-empty relative path.`);
    return false;
  }
  if (
    path.isAbsolute(value) ||
    value.includes("\\") ||
    value.split("/").includes("..")
  ) {
    error(
      `${entryId}: ${label} must be a slash-delimited path inside the repository.`,
    );
    return false;
  }
  if (!value.startsWith(prefix)) {
    error(`${entryId}: ${label} must start with ${prefix}.`);
    return false;
  }
  return true;
}

async function fileExists(relativePath) {
  try {
    return (await stat(path.join(repoRoot, relativePath))).isFile();
  } catch {
    return false;
  }
}

async function collectMarkdownFiles(relativePath) {
  const directory = path.join(repoRoot, relativePath);
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const childPath = path.posix.join(relativePath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(childPath)));
    } else if (entry.isFile() && /\.mdx?$/.test(entry.name)) {
      files.push(childPath);
    }
  }
  return files;
}

async function collectRustCallablePages() {
  const files = await collectMarkdownFiles("dev-docs/docs/sdks/rust/api");
  const pages = [];
  for (const file of files) {
    const document = await readFile(path.join(repoRoot, file), "utf8");
    if (/^# (?:Function|Method): /m.test(document)) pages.push(file);
  }
  return pages;
}

function slugifyHeading(value) {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/[`*_~]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function collectAnchors(document) {
  const anchors = new Set();
  const headingOccurrences = new Map();
  for (const line of document.split(/\r?\n/)) {
    const explicitId = /\bid\s*=\s*["']([^"']+)["']/.exec(line);
    if (explicitId) anchors.add(explicitId[1]);
    const heading = /^#{1,6}\s+(.+?)\s*#*\s*$/.exec(line);
    if (!heading) continue;
    const headingText = heading[1].replace(/\s+\{#[^}]+\}\s*$/, "");
    const explicitHeadingId = /\{#([^}]+)\}\s*$/.exec(heading[1]);
    if (explicitHeadingId) {
      anchors.add(explicitHeadingId[1]);
      continue;
    }
    const base = slugifyHeading(headingText);
    if (!base) continue;
    const occurrence = headingOccurrences.get(base) ?? 0;
    headingOccurrences.set(base, occurrence + 1);
    anchors.add(occurrence === 0 ? base : `${base}-${occurrence}`);
  }
  return anchors;
}

async function validateTarget(entry) {
  const { id, target } = entry;
  if (!validatePath(target.path, "target.path", id, "dev-docs/")) return;
  if (!/\.mdx?$/.test(target.path)) {
    error(`${id}: target.path must name a Markdown or MDX document.`);
    return;
  }
  if (!(await fileExists(target.path))) {
    error(`${id}: target document is missing: ${target.path}`);
    return;
  }
  if (!target.anchor) return;
  try {
    const anchors = collectAnchors(
      await readFile(path.join(repoRoot, target.path), "utf8"),
    );
    if (!anchors.has(target.anchor)) {
      error(
        `${id}: anchor "#${target.anchor}" is missing from ${target.path}. Add a matching heading or explicit id.`,
      );
    }
  } catch (cause) {
    error(
      `${id}: could not read target document ${target.path}: ${cause.message}`,
    );
  }
}

async function validateRustCallable(entry) {
  const { id, source, symbol } = entry;
  if (!isNonEmptyString(symbol)) {
    error(`${id}: rust-callable entries require symbol.`);
    return;
  }
  const parts = symbol.split("::");
  if (
    parts.length > 2 ||
    !parts.every(isRustIdentifier) ||
    (parts.length === 2 && !/^[A-Z]/.test(parts[0]))
  ) {
    error(
      `${id}: symbol must be a Rust function name or Type::method identifier.`,
    );
    return;
  }
  if (!isNonEmptyString(source) || !(await fileExists(source))) return;
  try {
    const rustSource = await readFile(path.join(repoRoot, source), "utf8");
    resolveRustDeclaration(rustSource, symbol);
  } catch (cause) {
    error(`${id}: could not resolve Rust source ${source}: ${cause.message}`);
  }
}

let manifest;
try {
  manifest = JSON.parse(await readFile(manifestPath, "utf8"));
} catch (cause) {
  console.error(
    `API coverage validation failed: cannot parse ${manifestPath}: ${cause.message}`,
  );
  process.exitCode = 1;
  process.exit();
}

if (!isObject(manifest)) {
  error("Manifest root must be an object.");
} else {
  if (manifest.schemaVersion !== 1) error("schemaVersion must be 1.");
  if (
    !Array.isArray(manifest.requiredProducts) ||
    manifest.requiredProducts.length === 0
  ) {
    error("requiredProducts must be a non-empty array.");
  } else {
    for (const product of manifest.requiredProducts) {
      if (!products.has(product))
        error(`requiredProducts contains unsupported product "${product}".`);
    }
  }
  if (!Array.isArray(manifest.entries) || manifest.entries.length === 0) {
    error("entries must be a non-empty array.");
  }
}

if (errors.length === 0) {
  const seenIds = new Set();
  const seenRustCallables = new Set();
  const rustCallableTargets = new Set();
  const coveredProducts = new Set();
  const targetChecks = [];
  for (const [index, entry] of manifest.entries.entries()) {
    const location = `entries[${index}]`;
    if (!isObject(entry)) {
      error(`${location} must be an object.`);
      continue;
    }
    const id = isNonEmptyString(entry.id) ? entry.id : location;
    if (!isNonEmptyString(entry.id))
      error(`${location}.id must be a non-empty string.`);
    else if (seenIds.has(entry.id)) error(`${id}: duplicate entry id.`);
    else seenIds.add(entry.id);
    if (!products.has(entry.product))
      error(`${id}: product must be rust, cli, or sdk-proxy.`);
    else coveredProducts.add(entry.product);
    if (!kinds.has(entry.kind))
      error(`${id}: unknown entry kind "${entry.kind}".`);
    if (
      (entry.kind === "rust-family" || entry.kind === "rust-callable") &&
      entry.product !== "rust"
    )
      error(`${id}: ${entry.kind} entries must use product rust.`);
    if (entry.kind === "cli-command" && entry.product !== "cli")
      error(`${id}: cli-command entries must use product cli.`);
    if (entry.kind === "proxy-route" && entry.product !== "sdk-proxy")
      error(`${id}: proxy-route entries must use product sdk-proxy.`);
    const sourceIsValid = validatePath(entry.source, "source", id, "");
    if (sourceIsValid && !(await fileExists(entry.source)))
      error(`${id}: source file is missing: ${entry.source}`);
    if (!isObject(entry.target))
      error(`${id}: target must be an object with path and optional anchor.`);
    else {
      if (
        entry.target.anchor !== undefined &&
        !isNonEmptyString(entry.target.anchor)
      )
        error(`${id}: target.anchor must be a non-empty string when provided.`);
      if (manifest.requiredProducts.includes(entry.product)) {
        targetChecks.push(validateTarget(entry));
      }
    }
    if (entry.kind === "cli-command" && !isNonEmptyString(entry.command))
      error(`${id}: cli-command entries require command.`);
    if (entry.kind === "rust-callable") {
      if (!sourceIsValid || !entry.source.endsWith(".rs"))
        error(`${id}: rust-callable source must be a Rust source file.`);
      else {
        if (
          !isObject(entry.target) ||
          !isNonEmptyString(entry.target.path) ||
          !/^dev-docs\/docs\/sdks\/rust\/api\/(?:shared|non-blocking|blocking)\/[^/]+\/[^/]+\.mdx$/.test(
            entry.target.path,
          )
        ) {
          error(
            `${id}: rust-callable targets must be child pages beneath an API family route.`,
          );
        }
        const callableKey = `${entry.source}::${entry.symbol}`;
        if (seenRustCallables.has(callableKey)) {
          error(`${id}: duplicate rust-callable source symbol ${callableKey}.`);
        } else {
          seenRustCallables.add(callableKey);
        }
        if (isObject(entry.target) && isNonEmptyString(entry.target.path)) {
          if (rustCallableTargets.has(entry.target.path)) {
            error(
              `${id}: duplicate rust-callable target ${entry.target.path}.`,
            );
          } else {
            rustCallableTargets.add(entry.target.path);
          }
        }
        targetChecks.push(validateRustCallable(entry));
      }
    }
    if (entry.kind === "proxy-route") {
      if (entry.method !== "GET")
        error(`${id}: proxy-route entries require method GET.`);
      if (!isNonEmptyString(entry.route) || !entry.route.startsWith("/"))
        error(`${id}: proxy-route entries require an absolute route.`);
      if (!proxyStatuses.has(entry.status))
        error(`${id}: proxy-route entries require a valid status.`);
    }
  }
  for (const product of manifest.requiredProducts) {
    if (!coveredProducts.has(product))
      error(`Manifest has no entries for required product "${product}".`);
  }
  await Promise.all(targetChecks);
  try {
    const documentedCallables = await collectRustCallablePages();
    for (const target of documentedCallables) {
      if (!rustCallableTargets.has(target)) {
        error(`Rust callable page has no coverage entry: ${target}.`);
      }
    }
    for (const target of rustCallableTargets) {
      if (!documentedCallables.includes(target)) {
        error(`Rust callable target is not an API page: ${target}.`);
      }
    }
  } catch (cause) {
    error(`Could not inspect Rust callable pages: ${cause.message}`);
  }
}

if (errors.length > 0) {
  console.error(
    `API coverage validation failed with ${errors.length} error(s):`,
  );
  for (const message of errors) console.error(`- ${message}`);
  process.exitCode = 1;
} else {
  const counts = manifest.entries.reduce((result, entry) => {
    result[entry.product] = (result[entry.product] ?? 0) + 1;
    return result;
  }, {});
  console.log(
    `API coverage valid: ${manifest.entries.length} entries (${Object.entries(
      counts,
    )
      .map(([product, count]) => `${product}: ${count}`)
      .join(", ")}).`,
  );
}
