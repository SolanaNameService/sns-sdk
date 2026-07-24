<p align="center">
  <img width="200" src="https://www.sns.id/assets/logo/brand.svg" alt="SNS logo" />
</p>

# SNS SDKs

Official SDKs, React hooks, a CLI, and an experimental REST proxy for integrating with Solana Name Service (SNS).

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

## Contents

- [Documentation](#documentation)
- [Choose an integration](#choose-an-integration)
- [JS Kit](#js-kit)
- [JavaScript SDK](#javascript-sdk)
- [Rust SDK](#rust-sdk)
- [CLI](#cli)
- [REST proxy](#rest-proxy)
- [React hooks](#react-hooks)
- [Compatibility and migration](#compatibility-and-migration)
- [Repository map](#repository-map)
- [License](#license)

## Documentation

The complete SDK and API documentation is available at [dev.sns.id](https://dev.sns.id/). For general SNS guides, visit [guide.sns.id](https://guide.sns.id/).

This README is an integration overview. Use the developer documentation and package-specific guides for complete API details.

## Choose an integration

| Integration               | Use it for                                                           | Guide                                       |
| ------------------------- | -------------------------------------------------------------------- | ------------------------------------------- |
| JavaScript SDK            | TypeScript or JavaScript applications using `@solana/web3.js` 1.x    | [JavaScript SDK](./js/README.md)            |
| JS Kit SDK                | TypeScript applications using `@solana/kit` on Node.js 24+           | [JS Kit SDK](./js-kit/README.md)            |
| Rust SDK                  | Async or blocking Rust applications on the Solana 2.1 client stack   | [Rust SDK](./rust-crates/sns-sdk/README.md) |
| React hooks               | React 18 or 19 applications using the JavaScript SDK and React Query | [React hooks](./react/README.md)            |
| CLI                       | Mainnet SNS reads and administration from a terminal                 | [CLI](./rust-crates/sns-cli/README.md)      |
| REST proxy (experimental) | HTTP integrations that cannot use a native SDK                       | [REST proxy](./sdk-proxy/README.md)         |

## JavaScript SDK

Use the JavaScript SDK with applications built on `@solana/web3.js` 1.x.

```bash
npm install @bonfida/spl-name-service @solana/web3.js
```

```typescript
import { resolve } from "@bonfida/spl-name-service/domain";
import { Connection } from "@solana/web3.js";

const connection = new Connection(process.env.RPC_URL!);
const owner = await resolve(connection, "mydomain.sns");
```

See the [JavaScript SDK package guide](./js/README.md) and [v4 migration guide](./js/CHANGELOG.md).

## JS Kit SDK

Use JS Kit SDK with applications built on `@solana/kit`. It requires Node.js 24 or later.

```bash
npm install @solana-name-service/sns-sdk-kit @solana/kit
```

```typescript
import { resolve } from "@solana-name-service/sns-sdk-kit/domain";
import {
  createDefaultRpcTransport,
  createSolanaRpcFromTransport,
} from "@solana/kit";

const transport = createDefaultRpcTransport({
  url: process.env.RPC_URL!,
});
const rpc = createSolanaRpcFromTransport(transport);

const owner = await resolve({ rpc, domain: "mydomain.sns" });
```

See the [JS Kit package guide](./js-kit/README.md) and [v1 migration guide](./js-kit/CHANGELOG.md).

## Rust SDK

The Rust SDK provides asynchronous APIs by default. Enable its `blocking` feature when synchronous APIs are required.

```bash
cargo add sns-sdk
```

Given a `solana_client::nonblocking::rpc_client::RpcClient` named `client`:

```rust
use sns_sdk::non_blocking::resolve::{resolve, AllowPda};

let owner = resolve(&client, "mydomain.sns", AllowPda::Deny).await?;
```

See the [Rust SDK package guide](./rust-crates/sns-sdk/README.md) and [v2 migration guide](./rust-crates/sns-sdk/CHANGELOG.md).

## CLI

Install the published CLI crate. It provides the `sns` executable.

```bash
cargo install sns-cli
```

```bash
sns resolve mydomain.sns
```

Run `sns --help` for the current command list and `sns <command> --help` for command-specific options.

See the [CLI guide](./rust-crates/sns-cli/README.md) for runtime configuration, domain rules, and the complete command reference.

## REST proxy

> **Experimental:** The REST proxy is provided for integrations that cannot use a native SDK. Its availability and API may change.

- All application routes use `GET`.
- The `/resolve/:domain` route requires a full domain name ending in `.sns` or `.sol`, for example `mydomain.sns` or `mydomain.sol`.
- All other routes that accept a domain name assume an `.sns` domain and require a TLD-less value. Pass `mydomain` or `sub.mydomain`, not `mydomain.sns`.

Available endpoints:

- **Resolution:** `/resolve/:domain`
- **Domains and ownership:** `/domain-key/:domain`, `/domains/:owner`, `/primary-domain/:owner`, `/multiple-primary-domains/:owners`, `/reverse-key/:domain`, `/reverse-lookup/:pubkey`, `/subdomains/:parent`
- **Compatibility aliases:** `/favorite-domain/:owner`, `/multiple-favorite-domains/:owners`
- **Records:** `/types/record`, `/record-key-v2/:domain/:record`, `/record-v2/:domain/:record`, `/records-v2/:domain?records=<csv>`
- **Instruction construction:** `/register`, `/create-subdomain`

See the [REST proxy guide](./sdk-proxy/README.md) for query parameters, request conventions, response and error types, RPC overrides, deprecated routes, and operational considerations.

## React hooks

`@bonfida/sns-react` provides React Query hooks for SNS data in applications using `@solana/web3.js`.

```bash
npm install @bonfida/sns-react @bonfida/spl-name-service@^4.0.0 @solana/web3.js@^1.98.2 @tanstack/react-query@^5.0.0 react
```

Wrap the application in TanStack Query's `QueryClientProvider` before using the hooks.

```tsx
import { useResolve } from "@bonfida/sns-react";
import type { Connection } from "@solana/web3.js";

export function Resolve({ connection }: { connection: Connection }) {
  const { data, isPending } = useResolve(connection, "mydomain.sns");

  if (isPending) return <span>Loading...</span>;
  return <span>{data?.toBase58() ?? "Not found"}</span>;
}
```

See the [React hooks package guide](./react/README.md) for peer dependencies and available hooks.

## Compatibility and migration

Domain behavior and public APIs can change between major versions. Review the relevant migration guide when upgrading:

- [JavaScript SDK v4 migration guide](./js/CHANGELOG.md)
- [JS Kit v1 migration guide](./js-kit/CHANGELOG.md)
- [Rust SDK v2 migration guide](./rust-crates/sns-sdk/CHANGELOG.md)
- [React hooks v4 migration guide](./react/CHANGELOG.md)

## Repository map

- [`js/`](./js/): JavaScript SDK for `@solana/web3.js` 1.x ([guide](./js/README.md))
- [`js-kit/`](./js-kit/): JavaScript SDK for `@solana/kit` ([guide](./js-kit/README.md))
- [`rust-crates/sns-sdk/`](./rust-crates/sns-sdk/): Rust SDK ([guide](./rust-crates/sns-sdk/README.md))
- [`rust-crates/sns-cli/`](./rust-crates/sns-cli/): `sns` command-line application ([guide](./rust-crates/sns-cli/README.md))
- [`sdk-proxy/`](./sdk-proxy/): Experimental Cloudflare Worker REST proxy ([guide](./sdk-proxy/README.md))
- [`react/`](./react/): React hooks for SNS ([guide](./react/README.md))

## License

This project is available under the [MIT License](./LICENSE).
