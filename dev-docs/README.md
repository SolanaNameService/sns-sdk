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

## After a Change

Run this from `dev-docs/` after any documentation change:

```bash
npm run api:generate && npm run check
```

`api:generate` refreshes the generated JavaScript, JS Kit, and React API references. If their source and configuration are unchanged, it produces no generated-content diff. `check` verifies formatting, TypeScript, handwritten API coverage, and generated API quality.

## Change Guide

| You changed                                                                                                           | What to run                                                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Migration, installation, Quickstart, Rust API, CLI, SDK Proxy, homepage, sidebar, configuration, or CSS documentation | `npm run api:generate && npm run check`                                                                                                                     |
| JavaScript, JS Kit, or React exported API or JSDoc                                                                    | Run that package's normal tests, then `npm run api:generate && npm run check` from `dev-docs/`.                                                             |
| Rust SDK, CLI, or SDK Proxy source                                                                                    | Run the affected product's normal source checks. If its developer documentation changed, also run `npm run api:generate && npm run check` from `dev-docs/`. |
| `scripts/check-generated-api-quality.mjs`                                                                             | `npm run api:quality:test && npm run check`                                                                                                                 |

If a new or removed exported JavaScript, JS Kit, or React symbol causes `npm run check` to report missing or stale generated API inventory entries, stop and review `api/generated-api-quality.json` before using `npm run api:quality:sync`. That command rewrites the full inventory and is not part of normal documentation work.

## Generated API References

Do not edit generated Markdown under these directories by hand:

- `docs/sdks/javascript/api/`
- `docs/sdks/js-kit/api/`
- `docs/react-hooks/api/`

Update exported source JSDoc in the corresponding SDK, then run the standard command above.

## Useful Commands

| Command                | Use                                                                            |
| ---------------------- | ------------------------------------------------------------------------------ |
| `npm start`            | Start the local documentation server.                                          |
| `npm run api:generate` | Regenerate TypeDoc API references.                                             |
| `npm run check`        | Run formatting, type checking, API coverage, and generated API quality checks. |
| `npm run build`        | Create a production build and validate links and anchors.                      |

The published site is configured for `https://dev.sns.id`.
