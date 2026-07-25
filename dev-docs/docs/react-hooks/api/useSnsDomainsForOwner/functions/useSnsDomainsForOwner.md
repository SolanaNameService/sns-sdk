---
displayed_sidebar: docsSidebar
---

[React Hooks API Reference](../../index.md) / [useSnsDomainsForOwner](../index.md) / useSnsDomainsForOwner

# Function: useSnsDomainsForOwner()

> **useSnsDomainsForOwner**\<`TData`\>(`connection`, `owner`, `options?`): `UseQueryResult`\<`NoInfer`\<`TData`\>, `Error`\>

Defined in: [react/src/hooks/useSnsDomainsForOwner/index.ts:34](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/react/src/hooks/useSnsDomainsForOwner/index.ts#L34)

Retrieves directly registry-owned top-level `.sns` domains for a wallet
through React Query.

Tokenized domains and subdomains are not included.

## Type Parameters

### TData

`TData` = `SnsDomain`[]

## Parameters

### connection

`Connection`

Solana RPC connection

### owner

`PublicKey` \| `null` \| `undefined`

Wallet public key, or a nullish value to disable the query

### options?

[`Options`](../../Types/type-aliases/Options.md)\<`SnsDomain`[], `TData`\> = `{}`

Optional React Query settings

## Returns

`UseQueryResult`\<`NoInfer`\<`TData`\>, `Error`\>

React Query result where `data` contains sorted domain names and
name account public keys; `isPending` tracks the initial request, while
failures populate `error` and set `isError` without throwing during render.

Query failures are exposed through the result's `error` and `isError` fields.

## Example

```tsx
const { data: domains } = useSnsDomainsForOwner(connection, wallet.publicKey);
```
