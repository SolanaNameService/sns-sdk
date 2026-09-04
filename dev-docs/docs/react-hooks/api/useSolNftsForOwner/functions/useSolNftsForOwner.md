---
displayed_sidebar: docsSidebar
---

[React Hooks API Reference](../../index.md) / [useSolNftsForOwner](../index.md) / useSolNftsForOwner

# Function: useSolNftsForOwner()

> **useSolNftsForOwner**\<`TData`\>(`connection`, `owner`, `options?`): `UseQueryResult`\<`NoInfer`\<`TData`\>, `Error`\>

Defined in: [react/src/hooks/useSolNftsForOwner/index.ts:33](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/react/src/hooks/useSolNftsForOwner/index.ts#L33)

Retrieves non-expired tokenized `.sol` domains owned by a wallet through
React Query.

Returned domain names are TLD-trimmed and include the SRS record and NFT mint
public keys.

## Type Parameters

### TData

`TData` = `SolNft`[]

## Parameters

### connection

`Connection`

Solana RPC connection

### owner

`PublicKey` \| `null` \| `undefined`

Wallet public key, or a nullish value to disable the query

### options?

[`Options`](../../Types/type-aliases/Options.md)\<`SolNft`[], `TData`\> = `{}`

Optional React Query settings

## Returns

`UseQueryResult`\<`NoInfer`\<`TData`\>, `Error`\>

React Query result where `data` contains sorted tokenized domain
records; `isPending` tracks the initial request, while failures populate
`error` and set `isError` without throwing during render.

## Example

```tsx
const { data: domains } = useSolNftsForOwner(connection, wallet.publicKey);
```
