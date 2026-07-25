# SNS Developer Documentation

This directory contains the Docusaurus site for Solana Name Service SDKs, React Hooks, CLI, SDK Proxy, and migration documentation.

## Install and Start

Use Node.js 24 or later.

From the repository root:

```bash
cd dev-docs
npm ci
npm start
```

The local site is usually available at `http://localhost:3000`.

Generating the JavaScript, JS Kit, and React API references also requires the dependencies of those source packages. Before the first API generation, install them from the repository root:

```bash
npm --prefix js ci
npm --prefix js-kit ci
npm --prefix react ci
```

## After a Change

Run this from `dev-docs/` after any documentation change:

```bash
npm run api:generate && npm run check
```

`api:generate` refreshes the generated JavaScript, JS Kit, and React API references. If their source and configuration are unchanged, it produces no generated-content diff. `check` verifies formatting, TypeScript, handwritten API coverage, and generated API quality.

## Change Guide

| You changed                                                                                                           | What to run                                                                                                                                                  |
| --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Migration, installation, Quickstart, Rust API, CLI, SDK Proxy, homepage, sidebar, configuration, or CSS documentation | `npm run api:generate && npm run check`                                                                                                                      |
| JavaScript, JS Kit, or React exported API or JSDoc                                                                    | Run that package's normal tests, then `npm run api:generate && npm run check` from `dev-docs/`.                                                              |
| Rust SDK source                                                                                                       | Run the Rust source checks, update handwritten Rust API coverage, then run `npm run api:rust-links:sync && npm run check && npm run build` from `dev-docs/`. |
| CLI source                                                                                                            | Run the CLI source checks, update handwritten CLI coverage, then run `npm run check && npm run build` from `dev-docs/`.                                      |
| SDK Proxy source                                                                                                      | Run the Proxy source checks. If its developer documentation changed, also run `npm run check && npm run build` from `dev-docs/`.                             |
| `scripts/check-generated-api-quality.mjs`                                                                             | `npm run api:quality:test && npm run check`                                                                                                                  |

If a new or removed exported JavaScript, JS Kit, or React symbol causes `npm run check` to report missing or stale generated API inventory entries, stop and review `api/generated-api-quality.json` before using `npm run api:quality:sync`. That command rewrites the full inventory and is not part of normal documentation work.

## Generated API References

Do not edit generated Markdown under these directories by hand:

- `docs/sdks/javascript/api/`
- `docs/sdks/js-kit/api/`
- `docs/react-hooks/api/`

Update exported source JSDoc in the corresponding SDK, then run the standard command above.

## Rust SDK Documentation

Rust API pages under `docs/sdks/rust/api/` are handwritten. Neither `api:generate` nor `cargo doc` updates them.

After adding, removing, renaming, moving, or changing a public Rust API:

1. Run the Rust SDK's normal source tests and checks from the repository root.
2. Update the affected Rust API page and its `rust-callable` entry in `api/api-coverage.json`. Add or remove both together when the documented public surface changes.
3. Run `npm run api:rust-links:sync` from `dev-docs/` to recalculate each `Defined in` line from the manifest's source path and symbol.
4. Review the synchronized MDX diff, then run `npm run check && npm run build`.
5. Commit the Rust documentation, coverage manifest, and synchronized source links with the SDK change.

Rust source links intentionally track `main`. New callable pages must use `<SourceLink path="..." line={...} />` rather than a hardcoded GitHub URL. `npm run check` runs the non-mutating source-link check and fails when a path or line is stale.

## CLI Documentation

CLI pages under `docs/cli/` are also handwritten. After adding, removing, renaming, or changing a command, flag, argument, output, or error contract:

1. Run the CLI's normal source tests and checks from the repository root.
2. Update the affected CLI page and its `cli-command` entry in `api/api-coverage.json`.
3. Run `npm run check && npm run build` from `dev-docs/`.
4. Commit the CLI documentation and coverage manifest with the CLI source change.

Ordinary CLI documentation changes do not require `api:rust-links:sync`. Run it only when the same change also moves or changes a documented Rust SDK callable.

## Useful Commands

| Command                       | Use                                                                                |
| ----------------------------- | ---------------------------------------------------------------------------------- |
| `npm start`                   | Start the development server with live reload, usually at `http://localhost:3000`. |
| `npm run build`               | Create the production site in `build/` and validate links and anchors.             |
| `npm run serve`               | Serve the production site from `build/` locally. Run `npm run build` first.        |
| `npm run clear`               | Clear Docusaurus-generated files and caches when generated content appears stale.  |
| `npm run api:generate`        | Regenerate TypeDoc API references.                                                 |
| `npm run api:rust-links:sync` | Recalculate handwritten Rust API source-line anchors.                              |
| `npm run check`               | Run formatting, type checking, API coverage, and generated API quality checks.     |

There is no `npm run server` script. Use `npm start` for local development or `npm run serve` to preview a production build.

The published site is configured for `https://dev.sns.id`.
