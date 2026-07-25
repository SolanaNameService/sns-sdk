import { createRequire } from "node:module";

import typescript from "@rollup/plugin-typescript";
import del from "rollup-plugin-delete";
import { dts } from "rollup-plugin-dts";

const require = createRequire(import.meta.url);
const packageJson = require("./package.json");
const externalPackages = new Set([
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.peerDependencies ?? {}),
]);

const external = (id) => {
  for (const packageName of externalPackages) {
    if (id === packageName || id.startsWith(`${packageName}/`)) return true;
  }
  return false;
};

export default [
  {
    input: "src/index.ts",
    external,
    output: [
      {
        dir: "dist",
        entryFileNames: "esm/index.mjs",
        format: "esm",
        sourcemap: true,
      },
      {
        dir: "dist",
        entryFileNames: "cjs/index.cjs",
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
    ],
    plugins: [
      del({
        targets: "dist",
        runOnce: true,
      }),
      typescript({ tsconfig: "./tsconfig.rollup.json" }),
    ],
  },
  {
    input: "dist/types-internal/index.d.ts",
    external,
    output: {
      file: "dist/types/index.d.ts",
      format: "es",
    },
    plugins: [
      dts(),
      del({
        targets: "dist/types-internal",
        hook: "writeBundle",
      }),
    ],
  },
];
