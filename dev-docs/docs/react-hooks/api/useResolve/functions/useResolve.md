---
displayed_sidebar: docsSidebar
---

[React Hooks API Reference](../../index.md) / [useResolve](../index.md) / useResolve

# Function: useResolve()

> **useResolve**\<`TData`\>(`connection`, `domain`, `options?`): `UseQueryResult`\<`NoInfer`\<`TData`\>, `Error`\>

Defined in: [react/src/hooks/useResolve/index.ts:27](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/react/src/hooks/useResolve/index.ts#L27)

Resolves a `.sns` or `.sol` domain to its target public key through React Query.

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

## Example

```tsx
const { data: address } = useResolve(connection, "example.sns");
```
