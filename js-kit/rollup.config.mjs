import typescript from "@rollup/plugin-typescript";
import { createRequire } from "node:module";
import path from "node:path";
import del from "rollup-plugin-delete";
import { dts } from "rollup-plugin-dts";
import { visualizer } from "rollup-plugin-visualizer";

const require = createRequire(import.meta.url);
const packageJson = require("./package.json");
const sourceRoot = path.resolve("src");

const isSourceModule = (id) => {
  if (!path.isAbsolute(id) || id.startsWith("\0")) return false;

  const relativePath = path.relative(sourceRoot, id);
  return (
    relativePath.length > 0 &&
    !path.isAbsolute(relativePath) &&
    relativePath !== ".." &&
    !relativePath.startsWith(`..${path.sep}`)
  );
};

const externalPackages = new Set([
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.peerDependencies ?? {}),
]);

const external = (id) => {
  for (const packageName of externalPackages) {
    if (id === packageName || id.startsWith(`${packageName}/`)) {
      return true;
    }
  }

  return false;
};

const sharedOutput = {
  dir: "dist",
  sourcemap: true,
  exports: "named",
  preserveModules: true,
  preserveModulesRoot: "src",
  generatedCode: "es2015",
};

const input = {
  index: "src/index.ts",
  "address/index": "src/address/index.ts",
  "bindings/index": "src/bindings/index.ts",
  codecs: "src/codecs.ts",
  "constants/index": "src/constants/index.ts",
  "domain/index": "src/domain/index.ts",
  errors: "src/errors.ts",
  "instructions/index": "src/instructions/index.ts",
  "nft/index": "src/nft/index.ts",
  "record/index": "src/record/index.ts",
  "states/index": "src/states/index.ts",
  "types/index": "src/types/index.ts",
  "utils/index": "src/utils/index.ts",
};

const declarationEntries = Object.keys(input);

const declarationConfigs = declarationEntries.map((name, index) => ({
  input: `dist/types-internal/${name}.d.ts`,
  external,
  output: {
    file: `dist/types/${name}.d.ts`,
    format: "es",
  },
  plugins: [
    dts(),
    ...(index === declarationEntries.length - 1
      ? [
          del({
            targets: "dist/types-internal",
            hook: "writeBundle",
          }),
        ]
      : []),
  ],
}));

/**
 * @type {import("rollup").RollupOptions[]}
 */
export default [
  {
    input,

    external,

    output: [
      {
        ...sharedOutput,
        format: "cjs",
        entryFileNames: "cjs/[name].cjs",
        chunkFileNames: "cjs/[name]-[hash].cjs",
        plugins: [
          visualizer({
            filename: "stats-cjs.html",
            gzipSize: true,
            brotliSize: true,
          }),
        ],
      },
      {
        ...sharedOutput,
        format: "esm",
        entryFileNames: "esm/[name].mjs",
        chunkFileNames: "esm/[name]-[hash].mjs",
        plugins: [
          visualizer({
            filename: "stats-esm.html",
            gzipSize: true,
            brotliSize: true,
          }),
        ],
      },
    ],

    plugins: [
      del({
        targets: "dist",
        runOnce: true,
      }),
      typescript({
        tsconfig: "./tsconfig.json",
      }),
    ],

    treeshake: {
      moduleSideEffects: (id, external) => external || !isSourceModule(id),
    },
  },
  ...declarationConfigs,
];
