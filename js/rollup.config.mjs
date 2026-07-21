import { createRequire } from "node:module";
import typescript from "@rollup/plugin-typescript";
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
  sourcemap: true,
  exports: "named",
  preserveModules: true,
  preserveModulesRoot: "src",
  generatedCode: "es2015",
};

export default {
  input: "src/index.ts",

  external,

  output: [
    {
      ...sharedOutput,
      dir: "dist/esm",
      format: "esm",
      entryFileNames: "[name].mjs",
      chunkFileNames: "[name]-[hash].mjs",
      plugins: [
        visualizer({
          filename: "stats-esm.html",
        }),
      ],
    },
    {
      ...sharedOutput,
      dir: "dist/cjs",
      format: "cjs",
      entryFileNames: "[name].cjs",
      chunkFileNames: "[name]-[hash].cjs",
      plugins: [
        visualizer({
          filename: "stats-cjs.html",
        }),
      ],
    },
  ],

  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: false,
      outDir: null,
      declarationDir: null,
    }),
    visualizer(),
  ],

  treeshake: true,
};
