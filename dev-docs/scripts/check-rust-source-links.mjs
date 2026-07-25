import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  formatSourceLink,
  parseLegacySourceLinks,
  parseSourceLinks,
  resolveRustDeclaration,
} from "./rust-source-links.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDirectory, "../..");
const manifestPath = path.join(repoRoot, "dev-docs/api/api-coverage.json");
const write = process.argv.includes("--write");
const unsupportedArguments = process.argv
  .slice(2)
  .filter((value) => value !== "--write");

if (unsupportedArguments.length > 0) {
  console.error(`Unsupported argument(s): ${unsupportedArguments.join(", ")}`);
  process.exit(1);
}

function updatedLabel(label, line) {
  return typeof label === "string" && /:\d+$/.test(label)
    ? label.replace(/:\d+$/, `:${line}`)
    : label;
}

async function inspect() {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const entries = manifest.entries.filter(
    (entry) => entry.kind === "rust-callable",
  );
  const errors = [];
  const changes = [];

  for (const entry of entries) {
    const sourcePath = path.join(repoRoot, entry.source);
    const targetPath = path.join(repoRoot, entry.target.path);
    let source;
    let document;
    let declaration;

    try {
      [source, document] = await Promise.all([
        readFile(sourcePath, "utf8"),
        readFile(targetPath, "utf8"),
      ]);
      declaration = resolveRustDeclaration(source, entry.symbol);
    } catch (cause) {
      errors.push(`${entry.id}: ${cause.message}`);
      continue;
    }

    let links;
    try {
      links = parseSourceLinks(document);
    } catch (cause) {
      errors.push(`${entry.id}: ${cause.message} in ${entry.target.path}`);
      continue;
    }
    const legacyLinks = parseLegacySourceLinks(document);

    if (links.length > 1) {
      errors.push(
        `${entry.id}: expected one SourceLink in ${entry.target.path}, found ${links.length}.`,
      );
      continue;
    }
    if (links.length === 1 && legacyLinks.length > 0) {
      errors.push(
        `${entry.id}: legacy Markdown source links are not allowed alongside SourceLink in ${entry.target.path}.`,
      );
      continue;
    }

    if (links.length === 0) {
      if (legacyLinks.length !== 1) {
        const detail = document.includes("<SourceLink")
          ? "SourceLink syntax is malformed"
          : `expected one source link, found ${legacyLinks.length}`;
        errors.push(`${entry.id}: ${detail} in ${entry.target.path}.`);
        continue;
      }
      const legacy = legacyLinks[0];
      if (legacy.path !== entry.source) {
        errors.push(
          `${entry.id}: source link path ${legacy.path} does not match manifest source ${entry.source}.`,
        );
        continue;
      }
      if (!write) {
        errors.push(
          `${entry.id}: legacy Markdown source link must be synchronized in ${entry.target.path}.`,
        );
        continue;
      }
      const replacement = formatSourceLink({
        path: entry.source,
        line: declaration.line,
        label: updatedLabel(legacy.label, declaration.line),
      });
      changes.push({
        targetPath,
        target: entry.target.path,
        document,
        start: legacy.start,
        end: legacy.end,
        replacement,
      });
      continue;
    }

    const link = links[0];
    if (link.path !== entry.source) {
      errors.push(
        `${entry.id}: SourceLink path ${link.path} does not match manifest source ${entry.source}.`,
      );
      continue;
    }

    const label = updatedLabel(link.label, declaration.line);
    if (link.line === declaration.line && label === link.label) continue;
    if (!write) {
      const staleValues = [];
      if (link.line !== declaration.line) {
        staleValues.push(`line ${link.line}`);
      }
      if (label !== link.label) {
        staleValues.push(`label ${JSON.stringify(link.label)}`);
      }
      errors.push(
        `${entry.id}: stale source reference in ${entry.target.path}; expected line ${declaration.line}, found ${staleValues.join(" and ")}.`,
      );
      continue;
    }
    changes.push({
      targetPath,
      target: entry.target.path,
      document,
      start: link.start,
      end: link.end,
      replacement: formatSourceLink({
        path: link.path,
        line: declaration.line,
        label,
      }),
    });
  }

  return { entries, errors, changes };
}

let result;
try {
  result = await inspect();
} catch (cause) {
  console.error(`Rust source-link validation failed: ${cause.message}`);
  process.exit(1);
}

if (result.errors.length > 0) {
  console.error(
    `Rust source-link validation failed with ${result.errors.length} error(s):`,
  );
  for (const message of result.errors) console.error(`- ${message}`);
  process.exit(1);
}

if (write && result.changes.length > 0) {
  for (const change of result.changes) {
    const updatedDocument =
      change.document.slice(0, change.start) +
      change.replacement +
      change.document.slice(change.end);
    await writeFile(change.targetPath, updatedDocument, "utf8");
  }

  const verification = await inspect();
  if (verification.errors.length > 0 || verification.changes.length > 0) {
    console.error("Rust source links did not validate after synchronization.");
    for (const message of verification.errors) console.error(`- ${message}`);
    process.exit(1);
  }
}

const action = write
  ? `synchronized ${result.changes.length} page(s)`
  : "valid";
console.log(
  `Rust source links ${action}: ${result.entries.length} callable pages.`,
);
