import { rmSync } from "node:fs";
import { createRequire } from "node:module";

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

export default {
  input: "dist/types-internal/index.d.ts",
  external,
  output: {
    file: "dist/types/index.d.ts",
    format: "es",
  },
  plugins: [
    dts(),
    {
      name: "remove-internal-declarations",
      writeBundle() {
        rmSync("dist/types-internal", { recursive: true, force: true });
      },
    },
  ],
};
