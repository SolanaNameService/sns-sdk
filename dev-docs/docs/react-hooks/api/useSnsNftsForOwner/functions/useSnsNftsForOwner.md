---
displayed_sidebar: docsSidebar
---

[React Hooks API Reference](../../index.md) / [useSnsNftsForOwner](../index.md) / useSnsNftsForOwner

# Function: useSnsNftsForOwner()

> **useSnsNftsForOwner**\<`TData`\>(`connection`, `owner`, `options?`): `UseQueryResult`\<`NoInfer`\<`TData`\>, `Error`\>

Defined in: [react/src/hooks/useSnsNftsForOwner/index.ts:32](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/react/src/hooks/useSnsNftsForOwner/index.ts#L32)

Retrieves tokenized `.sns` domains owned by a wallet through React Query.

Returned domain names are TLD-trimmed and include the name-service account
and NFT mint public keys.

## Type Parameters

### TData

`TData` = `SnsNft`[]

## Parameters

### connection

`Connection`

Solana RPC connection

### owner

`PublicKey` \| `null` \| `undefined`

Wallet public key, or a nullish value to disable the query

### options?

[`Options`](../../Types/type-aliases/Options.md)\<`SnsNft`[], `TData`\> = `{}`

Optional React Query settings

## Returns

`UseQueryResult`\<`NoInfer`\<`TData`\>, `Error`\>

React Query result where `data` contains sorted tokenized domain
records; `isPending` tracks the initial request, while failures populate
`error` and set `isError` without throwing during render.

## Example

```tsx
const { data: domains } = useSnsNftsForOwner(connection, wallet.publicKey);
```
