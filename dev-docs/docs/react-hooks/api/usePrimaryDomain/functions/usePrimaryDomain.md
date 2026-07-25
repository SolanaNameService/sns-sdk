---
displayed_sidebar: docsSidebar
---

[React Hooks API Reference](../../index.md) / [usePrimaryDomain](../index.md) / usePrimaryDomain

# Function: usePrimaryDomain()

> **usePrimaryDomain**\<`TData`\>(`connection`, `owner`, `options?`): `UseQueryResult`\<`NoInfer`\<`TData`\>, `Error`\>

Defined in: [react/src/hooks/usePrimaryDomain/index.ts:37](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/react/src/hooks/usePrimaryDomain/index.ts#L37)

Retrieves the primary domain set for a wallet through React Query.

## Type Parameters

### TData

`TData` = \{ `domain`: `PublicKey`; `reverse`: `string`; `stale`: `boolean`; \} \| `null`

## Parameters

### connection

`Connection`

Solana RPC connection

### owner

`PublicKey` \| `null` \| `undefined`

Wallet public key, or a nullish value to disable the query

### options?

[`Options`](../../Types/type-aliases/Options.md)\<\{ `domain`: `PublicKey`; `reverse`: `string`; `stale`: `boolean`; \} \| `null`, `TData`\> = `{}`

Optional React Query settings

## Returns

`UseQueryResult`\<`NoInfer`\<`TData`\>, `Error`\>

React Query result where `data` is the primary domain, reverse name,
and stale status, or `null` when none is set; `isPending` tracks the initial
request, while failures populate `error` and set `isError` without throwing
during render.

Query failures are exposed through the result's `error` and `isError` fields.

## Example

```tsx
const { data, isError } = usePrimaryDomain(connection, wallet.publicKey);
```
