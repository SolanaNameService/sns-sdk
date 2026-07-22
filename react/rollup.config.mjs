import { createRequire } from "node:module";

import typescript from "@rollup/plugin-typescript";

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

export default {
  input: "src/index.ts",
  external,
  output: [
    {
      file: "dist/esm/index.mjs",
      format: "esm",
      sourcemap: true,
    },
    {
      file: "dist/cjs/index.cjs",
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
  ],
  plugins: [typescript({ tsconfig: "./tsconfig.rollup.json" })],
};
