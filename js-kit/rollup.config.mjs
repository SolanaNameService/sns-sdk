import typescript from "@rollup/plugin-typescript";
import { createRequire } from "node:module";
import del from "rollup-plugin-delete";
import { visualizer } from "rollup-plugin-visualizer";

const require = createRequire(import.meta.url);
const packageJson = require("./package.json");

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

/**
 * @type {import("rollup").RollupOptions}
 */
export default {
  input: {
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
  },

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

  treeshake: true,
};
