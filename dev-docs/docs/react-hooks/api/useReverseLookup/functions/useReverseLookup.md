---
displayed_sidebar: docsSidebar
---

[React Hooks API Reference](../../index.md) / [useReverseLookup](../index.md) / useReverseLookup

# Function: useReverseLookup()

> **useReverseLookup**\<`TData`\>(`connection`, `pubkey`, `options?`): `UseQueryResult`\<`NoInfer`\<`TData`\>, `Error`\>

Defined in: [react/src/hooks/useReverseLookup/index.ts:27](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/react/src/hooks/useReverseLookup/index.ts#L27)

Performs a reverse lookup for a domain account through React Query.

## Type Parameters

### TData

`TData` = `string`

## Parameters

### connection

`Connection`

Solana RPC connection

### pubkey

`PublicKey` \| `null` \| `undefined`

Domain account public key, or a nullish value to disable the query

### options?

[`Options`](../../Types/type-aliases/Options.md)\<`string`, `TData`\> = `{}`

Optional React Query settings

## Returns

`UseQueryResult`\<`NoInfer`\<`TData`\>, `Error`\>

React Query result where `data` is the human-readable domain name;
`isPending` tracks the initial request, while failures populate `error` and
set `isError` without throwing during render.

Query failures are exposed through the result's `error` and `isError` fields.

## Example

```tsx
const { data: domain } = useReverseLookup(connection, domainAccount);
```
