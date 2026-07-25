import { spawnSync } from "node:child_process";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(scriptDirectory, "..");
const typedocBin = path.join(
  docsRoot,
  "node_modules",
  "typedoc",
  "bin",
  "typedoc",
);
const configs = [
  {
    id: "javascript",
    path: "api/typedoc-js.json",
    output: "docs/sdks/javascript/api",
    title: "JavaScript SDK API Reference",
  },
  {
    id: "js-kit",
    path: "api/typedoc-js-kit.json",
    output: "docs/sdks/js-kit/api",
    title: "JS Kit SDK API Reference",
  },
  {
    id: "react",
    path: "api/typedoc-react.json",
    output: "docs/react-hooks/api",
    title: "React Hooks API Reference",
  },
];

async function addDocusaurusFrontmatter(directory, rootDirectory, rootTitle) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await addDocusaurusFrontmatter(entryPath, rootDirectory, rootTitle);
      continue;
    }
    if (path.extname(entry.name) !== ".md") continue;

    const relativeDirectory = path.relative(rootDirectory, directory);
    const isRoot = relativeDirectory.length === 0;
    const isIndex = ["README.md", "index.md"].includes(entry.name);
    const markdown = await readFile(entryPath, "utf8");

    if (!isIndex) {
      const frontmatter = `---\ndisplayed_sidebar: docsSidebar\n---\n\n`;
      await writeFile(entryPath, `${frontmatter}${markdown}`);
      continue;
    }

    const label = isRoot ? "API Reference" : path.basename(directory);
    const title = isRoot ? rootTitle : `${label} API`;
    const displayedSidebar = isRoot ? "" : "displayed_sidebar: docsSidebar\n";
    const frontmatter = `---\ntitle: ${JSON.stringify(title)}\nsidebar_label: ${JSON.stringify(label)}\nhide_title: true\n${displayedSidebar}---\n\n`;
    await writeFile(entryPath, `${frontmatter}${markdown}`);
  }
}

const requestedConfig = process.argv[2];
const outputOverride = process.argv[3];
const selectedConfigs = requestedConfig
  ? configs.filter(({ id }) => id === requestedConfig)
  : configs;

if (requestedConfig && selectedConfigs.length === 0) {
  console.error(`Unknown API config: ${requestedConfig}`);
  process.exit(1);
}

if (outputOverride && selectedConfigs.length !== 1) {
  console.error("An output override requires exactly one API config.");
  process.exit(1);
}

for (const config of selectedConfigs) {
  console.log(`Generating API reference with ${config.path}`);
  const output = outputOverride ?? config.output;
  const result = spawnSync(
    process.execPath,
    [typedocBin, "--options", config.path, "--out", output],
    {
      cwd: docsRoot,
      encoding: "utf8",
      stdio: "inherit",
    },
  );
  if (result.error) {
    console.error(
      `Could not run TypeDoc for ${config.path}: ${result.error.message}`,
    );
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
  const outputDirectory = path.join(docsRoot, output);
  await addDocusaurusFrontmatter(
    outputDirectory,
    outputDirectory,
    config.title,
  );
}

console.log("TypeScript API references generated successfully.");
