---
displayed_sidebar: docsSidebar
---

[React Hooks API Reference](../../index.md) / [useSolDomainsForOwner](../index.md) / useSolDomainsForOwner

# Function: useSolDomainsForOwner()

> **useSolDomainsForOwner**\<`TData`\>(`connection`, `owner`, `options?`): `UseQueryResult`\<`NoInfer`\<`TData`\>, `Error`\>

Defined in: [react/src/hooks/useSolDomainsForOwner/index.ts:32](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/react/src/hooks/useSolDomainsForOwner/index.ts#L32)

Retrieves directly wallet-owned, non-expired top-level `.sol` domains
through React Query.

Tokenized domains and subdomains are not included.

## Type Parameters

### TData

`TData` = `SolDomain`[]

## Parameters

### connection

`Connection`

Solana RPC connection

### owner

`PublicKey` \| `null` \| `undefined`

Wallet public key, or a nullish value to disable the query

### options?

[`Options`](../../Types/type-aliases/Options.md)\<`SolDomain`[], `TData`\> = `{}`

Optional React Query settings

## Returns

`UseQueryResult`\<`NoInfer`\<`TData`\>, `Error`\>

React Query result where `data` contains sorted domain names and
SRS record public keys; `isPending` tracks the initial request, while
failures populate `error` and set `isError` without throwing during render.

## Example

```tsx
const { data: domains } = useSolDomainsForOwner(connection, wallet.publicKey);
```
