import { createRequire } from "node:module";

import typescript from "@rollup/plugin-typescript";
import del from "rollup-plugin-delete";
import { dts } from "rollup-plugin-dts";
import { visualizer } from "rollup-plugin-visualizer";

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

const input = {
  index: "src/index.ts",
  "address/index": "src/address/index.ts",
  "bindings/index": "src/bindings/index.ts",
  constants: "src/constants.ts",
  "domain/index": "src/domain/index.ts",
  errors: "src/error.ts",
  "instructions/index": "src/instructions/index.ts",
  "nft/index": "src/nft/index.ts",
  "record/index": "src/record/index.ts",
  "states/index": "src/states/index.ts",
  "twitter/index": "src/twitter/index.ts",
  "types/index": "src/types/index.ts",
  "utils/index": "src/utils/index.ts",
};

const sharedOutput = {
  dir: "dist",
  sourcemap: true,
  exports: "named",
  preserveModules: true,
  preserveModulesRoot: "src",
  generatedCode: "es2015",
};

const declarationEntries = Object.entries(input);
const declarationConfigs = declarationEntries.map(([name, source], index) => ({
  input: `dist/types-internal/${source.replace(/^src\//, "").replace(/\.ts$/, ".d.ts")}`,
  external,
  output: [
    {
      file: `dist/esm/${name}.d.ts`,
      format: "es",
    },
    {
      file: `dist/cjs/${name}.d.cts`,
      format: "es",
    },
  ],
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

export default [
  {
    input,
    external,
    output: [
      {
        ...sharedOutput,
        format: "esm",
        entryFileNames: "esm/[name].mjs",
        chunkFileNames: "esm/[name]-[hash].mjs",
        plugins: [visualizer({ filename: "stats-esm.html" })],
      },
      {
        ...sharedOutput,
        format: "cjs",
        entryFileNames: "cjs/[name].cjs",
        chunkFileNames: "cjs/[name]-[hash].cjs",
        plugins: [visualizer({ filename: "stats-cjs.html" })],
      },
    ],
    plugins: [
      del({
        targets: "dist",
        runOnce: true,
      }),
      typescript({ tsconfig: "./tsconfig.json" }),
      visualizer(),
    ],
    treeshake: true,
  },
  ...declarationConfigs,
];
