import assert from "node:assert/strict";
import { access, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(scriptDirectory, "..");
const inventoryPath = path.join(docsRoot, "api/generated-api-quality.json");
const defaultErrorRationale =
  "Pending source-level stable error classification.";

const products = {
  javascript: {
    docs: "docs/sdks/javascript/api",
    source: "js/src",
  },
  "js-kit": {
    docs: "docs/sdks/js-kit/api",
    source: "js-kit/src",
  },
  react: {
    docs: "docs/react-hooks/api",
    source: "react/src",
  },
};

const isNonEmpty = (value) =>
  typeof value === "string" && value.trim().length > 0;

function compareText(left, right) {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

const compareIds = (left, right) => compareText(left.id, right.id);

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((left, right) =>
    compareText(left.name, right.name),
  )) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectFiles(entryPath)));
    else files.push(entryPath);
  }
  return files;
}

function relativePosix(from, to) {
  return path.relative(from, to).split(path.sep).join("/");
}

function countHeading(document, heading) {
  return document.match(new RegExp(`^## ${heading}$`, "gm"))?.length ?? 0;
}

function section(document, heading) {
  const marker = `## ${heading}`;
  const lines = document.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === marker);
  if (start < 0) return "";
  let end = lines.length;
  for (let index = start + 1; index < lines.length; index += 1) {
    if (lines[index].startsWith("## ")) {
      end = index;
      break;
    }
  }
  return lines
    .slice(start + 1, end)
    .join("\n")
    .trim();
}

function hasFence(value) {
  return /```[a-zA-Z0-9_-]*\s*[\s\S]+?```/.test(value);
}

function examples(document) {
  const matches = document.matchAll(
    /^#{2,3} Example\s*\r?\n\r?\n(```[\s\S]*?```)/gm,
  );
  return [...new Set([...matches].map((match) => match[1].trim()))];
}

function purpose(document) {
  const definedAt = document.indexOf("Defined in:");
  if (definedAt < 0) return "";
  const afterDefined = document.indexOf("\n", definedAt);
  const nextSection = document.indexOf("\n## ", afterDefined);
  return document
    .slice(afterDefined, nextSection < 0 ? document.length : nextSection)
    .trim();
}

function subsectionBodies(document, parentHeading, childPrefix = "###") {
  const parent = section(document, parentHeading);
  const lines = parent.split(/\r?\n/);
  const result = [];
  let current = null;
  for (const line of lines) {
    if (line.startsWith(`${childPrefix} `)) {
      if (current) {
        current.body = current.lines.join("\n").trim();
        delete current.lines;
        result.push(current);
      }
      current = {
        name: line.slice(childPrefix.length + 1).trim(),
        lines: [],
      };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) {
    current.body = current.lines.join("\n").trim();
    delete current.lines;
    result.push(current);
  }
  return result;
}

function hasDescription(body) {
  const prose = body.split(/\r?\n/).filter((line) => {
    const trimmed = line.trim();
    return (
      trimmed &&
      !trimmed.startsWith(">") &&
      !trimmed.startsWith("Defined in:") &&
      !/^`[^`]+`(?:\s*=\s*`[^`]+`)?$/.test(trimmed) &&
      trimmed !== "***"
    );
  });
  return prose.length > 0;
}

export function validateDocument(entry, document) {
  const errors = [];
  const label = entry.page;
  if ((document.match(/^# /gm) ?? []).length !== 1)
    errors.push(`${label}: expected exactly one H1.`);
  if (!purpose(document)) errors.push(`${label}: missing purpose prose.`);

  const documentedExamples = examples(document);
  const exampleCount = documentedExamples.length;
  if (exampleCount !== 1)
    errors.push(`${label}: expected exactly one Example section.`);
  else if (!hasFence(documentedExamples[0]))
    errors.push(`${label}: Example must contain a fenced code block.`);

  const example = documentedExamples.join("\n");
  if (
    /\b(?:console\.log|println!|print!)\b/.test(example) &&
    !/\/\/\s*=>/.test(example)
  )
    errors.push(`${label}: logged example output requires a // => comment.`);

  if (entry.kind === "function") {
    // TypeDoc renders overload return documentation under each call signature.
    if (!section(document, "Returns") && !document.includes("### Returns"))
      errors.push(`${label}: missing Returns section.`);
    for (const parameter of subsectionBodies(document, "Parameters")) {
      if (!hasDescription(parameter.body))
        errors.push(
          `${label}: parameter ${parameter.name} lacks a description.`,
        );
    }
    const throwsCount = countHeading(document, "Throws");
    if (throwsCount > 1)
      errors.push(`${label}: repeated Throws sections are not allowed.`);
    if (entry.errorMode === "throws" && throwsCount !== 1)
      errors.push(
        `${label}: classified throws API requires one Throws section.`,
      );
    if (
      entry.errorMode === "query-result" &&
      !/\b(?:error|isError)\b/.test(document)
    )
      errors.push(`${label}: React query API must document error/isError.`);
    if (entry.errorMode === "none" && !isNonEmpty(entry.errorRationale))
      errors.push(`${label}: errorMode none requires errorRationale.`);
    if (
      entry.transitionSensitive &&
      (!document.includes("452_825_395") ||
        !document.includes("SRS-backed") ||
        !document.includes("pauses automatically"))
    )
      errors.push(`${label}: missing required .sol transition behavior.`);
  } else {
    const properties = subsectionBodies(document, "Properties");
    if (properties.length === 0)
      errors.push(`${label}: missing Properties section.`);
    for (const property of properties) {
      if (!hasDescription(property.body))
        errors.push(`${label}: property ${property.name} lacks a description.`);
    }
    for (const requiredLink of entry.requiredLinks ?? []) {
      if (!document.includes(requiredLink))
        errors.push(`${label}: missing related link text ${requiredLink}.`);
    }
  }
  return errors;
}

function sourceFromDocument(product, document) {
  const source = /Defined in: \[([^\]]+):\d+\]/.exec(document)?.[1];
  if (!source) return "";
  return source.startsWith(`${products[product].source}/`)
    ? source
    : `${products[product].source}/${source}`;
}

async function scanPages() {
  const entries = [];
  for (const [product, config] of Object.entries(products)) {
    const productRoot = path.join(docsRoot, config.docs);
    for (const filePath of await collectFiles(productRoot)) {
      const normalized = relativePosix(productRoot, filePath);
      const kind = normalized.includes("/functions/")
        ? "function"
        : normalized.includes("/interfaces/")
          ? "interface"
          : null;
      if (!kind || !filePath.endsWith(".md")) continue;
      const document = await readFile(filePath, "utf8");
      const page = `${config.docs}/${normalized}`;
      const hasThrows = countHeading(document, "Throws") > 0;
      const symbol =
        /^# (?:Function|Interface):\s+\\?([^\s(]+?)(?:\(\))?\s*$/m.exec(
          document,
        )?.[1];
      entries.push({
        id: `${product}:${normalized.replace(/\.md$/, "")}`,
        product,
        kind,
        source: sourceFromDocument(product, document),
        page,
        symbol: symbol ?? path.basename(filePath, ".md"),
        errorMode:
          product === "react" ? "query-result" : hasThrows ? "throws" : "none",
        ...(product !== "react" && !hasThrows
          ? {
              errorRationale: defaultErrorRationale,
            }
          : {}),
        transitionSensitive: false,
        requiredLinks: [],
      });
    }
  }
  return entries;
}

function mergeInventoryEntries(scannedEntries, existingEntries) {
  const existingById = new Map(
    existingEntries.map((entry) => [entry.id, entry]),
  );

  return scannedEntries
    .map((scanned) => {
      const existing = existingById.get(scanned.id);
      if (!existing) return scanned;

      const merged = {
        ...scanned,
        errorMode: existing.errorMode ?? scanned.errorMode,
        transitionSensitive:
          existing.transitionSensitive ?? scanned.transitionSensitive,
        requiredLinks: existing.requiredLinks ?? scanned.requiredLinks,
      };

      delete merged.errorRationale;
      if (Object.hasOwn(existing, "errorRationale"))
        merged.errorRationale = existing.errorRationale;
      else if (merged.errorMode === "none")
        merged.errorRationale = scanned.errorRationale ?? defaultErrorRationale;

      return merged;
    })
    .sort(compareIds);
}

async function readInventory() {
  if (!(await exists(inventoryPath))) return { schemaVersion: 1, entries: [] };

  const inventory = JSON.parse(await readFile(inventoryPath, "utf8"));
  if (inventory.schemaVersion !== 1 || !Array.isArray(inventory.entries))
    throw new Error(`Invalid generated API inventory: ${inventoryPath}`);
  return inventory;
}

async function syncInventory() {
  const [scannedEntries, existingInventory] = await Promise.all([
    scanPages(),
    readInventory(),
  ]);
  const entries = mergeInventoryEntries(
    scannedEntries,
    existingInventory.entries,
  );

  const inventory = { schemaVersion: 1, entries };
  await writeFile(inventoryPath, `${JSON.stringify(inventory, null, 2)}\n`);
  console.log(`Wrote ${entries.length} entries to ${inventoryPath}.`);
}

async function selfTest() {
  const base = {
    page: "fixture.md",
    kind: "function",
    errorMode: "none",
    errorRationale: "Pure helper.",
    transitionSensitive: false,
  };
  const valid = `# Function: sample()\n\nDefined in: [sample.ts:1](#)\n\nDoes work.\n\n## Parameters\n\n### value\n\n\`string\`\n\nInput value.\n\n## Returns\n\n\`string\`\n\nOutput value.\n\n## Example\n\n\`\`\`ts\nsample(\"value\");\n\`\`\``;
  const cases = [
    [valid, 0],
    [valid.replace(/## Example[\s\S]*/, ""), 1],
    [valid.replace("Input value.", ""), 1],
    [{ ...base, errorMode: "throws" }, valid, 1],
    [{ ...base, transitionSensitive: true }, valid, 1],
  ];
  for (const test of cases) {
    const [entry, document, minimum] =
      typeof test[0] === "string" ? [base, test[0], test[1]] : test;
    const errors = validateDocument(entry, document);
    if (errors.length < minimum)
      throw new Error(
        `Quality checker self-test failed: ${JSON.stringify(test)}`,
      );
  }

  const scannedEntries = [
    {
      id: "product:b",
      source: "b.ts",
      errorMode: "none",
      errorRationale: defaultErrorRationale,
      transitionSensitive: false,
      requiredLinks: [],
    },
    {
      id: "product:a",
      source: "new-a.ts",
      errorMode: "throws",
      transitionSensitive: false,
      requiredLinks: [],
    },
  ];
  const mergedEntries = mergeInventoryEntries(scannedEntries, [
    {
      id: "product:a",
      source: "old-a.ts",
      errorMode: "none",
      errorRationale: "Curated rationale.",
      transitionSensitive: true,
      requiredLinks: ["Required link"],
    },
  ]);
  assert.deepEqual(
    mergedEntries.map(({ id }) => id),
    ["product:a", "product:b"],
  );
  assert.deepEqual(mergedEntries[0], {
    id: "product:a",
    source: "new-a.ts",
    errorMode: "none",
    errorRationale: "Curated rationale.",
    transitionSensitive: true,
    requiredLinks: ["Required link"],
  });
  console.log("Generated API quality checker self-test passed.");
}

async function checkInventory() {
  if (!(await exists(inventoryPath))) {
    console.error(`Missing inventory: ${inventoryPath}. Run with --sync.`);
    process.exitCode = 1;
    return;
  }
  const inventory = await readInventory();
  const scanned = await scanPages();
  const scannedIds = new Set(scanned.map(({ id }) => id));
  const inventoryIds = new Set(inventory.entries.map(({ id }) => id));
  const errors = [];
  if (inventoryIds.size !== inventory.entries.length)
    errors.push("Generated API inventory contains duplicate IDs.");
  const canonicalIds = [...inventory.entries]
    .sort(compareIds)
    .map(({ id }) => id);
  if (canonicalIds.some((id, index) => id !== inventory.entries[index]?.id))
    errors.push(
      "Generated API inventory is not in canonical order. Run api:quality:sync.",
    );
  for (const id of scannedIds)
    if (!inventoryIds.has(id))
      errors.push(`Uninventoried generated page: ${id}`);
  for (const id of inventoryIds)
    if (!scannedIds.has(id)) errors.push(`Stale inventory entry: ${id}`);
  for (const entry of inventory.entries) {
    if (!isNonEmpty(entry.source))
      errors.push(`${entry.id}: missing source path.`);
    const pagePath = path.join(docsRoot, entry.page);
    if (!(await exists(pagePath))) {
      errors.push(`${entry.id}: missing generated page ${entry.page}.`);
      continue;
    }
    errors.push(...validateDocument(entry, await readFile(pagePath, "utf8")));
  }
  if (errors.length) {
    console.error(
      `Generated API quality failed with ${errors.length} error(s):`,
    );
    for (const message of errors) console.error(`- ${message}`);
    process.exitCode = 1;
  } else {
    console.log(
      `Generated API quality valid: ${inventory.entries.length} pages.`,
    );
  }
}

if (process.argv.includes("--sync")) await syncInventory();
else if (process.argv.includes("--self-test")) await selfTest();
else await checkInventory();
