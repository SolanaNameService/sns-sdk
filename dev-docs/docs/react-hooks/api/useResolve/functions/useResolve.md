---
displayed_sidebar: docsSidebar
---

[React Hooks API Reference](../../index.md) / [useResolve](../index.md) / useResolve

# Function: useResolve()

> **useResolve**\<`TData`\>(`connection`, `domain`, `options?`): `UseQueryResult`\<`NoInfer`\<`TData`\>, `Error`\>

Defined in: [react/src/hooks/useResolve/index.ts:30](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/react/src/hooks/useResolve/index.ts#L30)

Resolves a `.sns` or `.sol` domain to its target public key through React Query.
`.sol` domains are resolved through the JavaScript SDK's SRS route.

## Type Parameters

### TData

`TData` = `PublicKey`

## Parameters

### connection

`Connection`

Solana RPC connection

### domain

`string` \| `null` \| `undefined`

Full `.sns` or `.sol` domain name, or a nullish value to disable the query

### options?

[`Options`](../../Types/type-aliases/Options.md)\<`PublicKey`, `TData`\> = `{}`

Optional React Query settings

## Returns

`UseQueryResult`\<`NoInfer`\<`TData`\>, `Error`\>

React Query result where `data` is the resolved target public key;
`isPending` tracks the initial request, while failures populate `error` and
set `isError` without throwing during render.

Query failures are exposed through the result's `error` and `isError` fields.
SRS resolution failures such as expired or malformed domains are surfaced
unchanged from the JavaScript SDK.

## Example

```tsx
const { data: address } = useResolve(connection, "example.sns");
```
