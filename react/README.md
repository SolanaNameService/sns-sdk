<p align="center">
  <img width="200" src="https://www.sns.id/assets/logo/brand.svg" alt="SNS logo" />
</p>

# SNS React

[![npm](https://img.shields.io/npm/v/@bonfida%2Fsns-react)](https://www.npmjs.com/package/@bonfida/sns-react)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE.md)

React Query hooks for the Solana Name Service JavaScript SDK v4. The package provides a focused set of read helpers with stable cache keys and safe record handling.

## Installation

Install SNS React with its peers:

```bash
npm install @bonfida/sns-react @bonfida/spl-name-service@^4.1.0 @solana/web3.js@^1.98.2 @tanstack/react-query@^5.0.0 react
```

SNS React supports React 18 and 19. The SNS JS SDK is a peer dependency so the application and hooks use one compatible v4 SDK instance.

## Setup

Create a TanStack Query client near the application root:

```tsx
import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

Pass a web3.js `Connection` to each hook. SNS React does not create a global RPC client or wallet provider.

## Quick Start

### Resolve A Domain

```tsx
import { useResolve } from "@bonfida/sns-react";
import { Connection } from "@solana/web3.js";

const connection = new Connection("https://your-rpc-endpoint.example");

function Resolve() {
  const target = useResolve(connection, "example.sns");

  if (target.isPending) return <p>Loading...</p>;
  if (target.isError) return <p>{target.error.message}</p>;
  return <p>{target.data.toBase58()}</p>;
}
```

Use `useSafeResolve` instead when `.sol` resolution must verify that the SRS and corresponding SNS targets agree.

### Read Verified Records

```tsx
import { Record } from "@bonfida/spl-name-service/record";
import { useRecords } from "@bonfida/sns-react";
import type { Connection } from "@solana/web3.js";

function Records({ connection }: { connection: Connection }) {
  const records = useRecords(
    connection,
    "example.sns",
    [Record.Url, Record.Email],
    { deserialize: true },
  );

  return (
    <ul>
      {records.data?.map((record, index) => (
        <li key={index}>{record?.deserializedContent ?? "Unavailable"}</li>
      ))}
    </ul>
  );
}
```

`useRecords` preserves request order. An entry is `undefined` when the account is missing or fails a required verification check.

## Domain Inputs

| Hook                                                                                                             | Input                                              | Notes                                                          |
| ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------- |
| `useResolve`                                                                                                     | Full `.sns` or `.sol` domain                       | `.sol` resolution uses the JS SDK's SRS route.                 |
| `useSafeResolve`                                                                                                 | Full `.sns` or `.sol` domain                       | For `.sol`, the SRS and corresponding SNS targets must match.  |
| `useRecords`, `useProfilePic`                                                                                    | Canonical lowercase `.sns` domain                  | Top-level domains and one-level subdomains are both supported. |
| `useSubdomains`                                                                                                  | TLD-trimmed `.sns` parent domain such as `example` | Passed to v4 `getSnsDomainKeySync`. Do not include `.sns`.     |
| `useSnsDomainsForOwner`, `useSnsNftsForOwner`, `useSolDomainsForOwner`, `useSolNftsForOwner`, `usePrimaryDomain` | Wallet `PublicKey`                                 | Nullish input disables the query.                              |
| `useReverseLookup`                                                                                               | Domain account `PublicKey`                         | Nullish input disables the query.                              |

## Record Safety

JS SDK v4 `getMultipleRecords` verifies record staleness and Right of Association (ROA). SNS React returns a record only when:

```ts
result.verified.staleness === true && result.verified.roa !== false;
```

`verified.roa` can be absent when the record type has no applicable ROA verifier. That is not a failed check. `verified.roa === false` is rejected.

`useProfilePic` uses the same checks and returns verified, deserialized content or `null`.

## API Reference

### `useResolve`

Resolves a full domain to its effective owner with v4 `resolve`.

```ts
useResolve(connection, domain, queryOptions?)
```

### `useSafeResolve`

Resolves a full domain through JS SDK `safeResolve`. For `.sol` domains, the SRS and corresponding `.sns` targets must match. Mismatches and other SDK failures are available through the query result's `error` and `isError` fields.

```ts
useSafeResolve(connection, domain, queryOptions?)
```

### `useSnsDomainsForOwner`

Returns `SnsDomain[]` values with `{ domain, key }`. Results include directly registry-owned top-level domains with valid reverse records. Tokenized domains and subdomains are not included.

```ts
useSnsDomainsForOwner(connection, ownerPublicKey, queryOptions?)
```

### `useSnsNftsForOwner`

Returns `SnsNft[]` values with `{ domain, key, mint }` for tokenized
`.sns` domains owned by the wallet. Domain names are TLD-trimmed.

```ts
useSnsNftsForOwner(connection, ownerPublicKey, queryOptions?)
```

### `useSolDomainsForOwner`

Returns `SolDomain[]` values with `{ domain, key }` for directly
wallet-owned, non-expired top-level `.sol` domains. Domain names are
TLD-trimmed. Tokenized domains and subdomains are not included.

```ts
useSolDomainsForOwner(connection, ownerPublicKey, queryOptions?)
```

### `useSolNftsForOwner`

Returns `SolNft[]` values with `{ domain, key, mint }` for non-expired
tokenized `.sol` domains owned by the wallet. Domain names are TLD-trimmed.

```ts
useSolNftsForOwner(connection, ownerPublicKey, queryOptions?)
```

### `usePrimaryDomain`

Returns the native v4 `{ domain, reverse, stale }` result. A missing primary domain returns `null`; RPC and other SDK errors remain query errors.

```ts
usePrimaryDomain(connection, ownerPublicKey, queryOptions?)
```

### `useSubdomains`

Derives a parent account from a TLD-trimmed SNS name and returns its human-readable subdomains.

```ts
useSubdomains(connection, "example", queryOptions?)
```

### `useReverseLookup`

Returns the reverse name for a domain account key.

```ts
useReverseLookup(connection, domainKey, queryOptions?)
```

### `useRecords`

Fetches, optionally deserializes, verifies, and filters multiple v4 records for
a canonical lowercase `.sns` domain or one-level `.sns` subdomain. `.sol`
names are rejected.

```ts
useRecords(
  connection,
  domain,
  records,
  { deserialize?: boolean },
  queryOptions?,
)
```

### `useProfilePic`

Returns safe `Record.Pic` content or `null`.

```ts
useProfilePic(connection, domain, queryOptions?)
```

## Documentation

- [Developer documentation](https://dev.sns.id/)
- [SNS React v4 changelog](./CHANGELOG.md)
- [JS SDK v4 README](../js/README.md)
- [SDK monorepo overview](../README.md)
- [SNS guide](https://guide.sns.id/)

## License

SNS React is licensed under the [MIT License](./LICENSE.md).
