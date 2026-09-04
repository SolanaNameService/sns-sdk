---
displayed_sidebar: docsSidebar
---

[React Hooks API Reference](../../index.md) / [useSafeResolve](../index.md) / useSafeResolve

# Function: useSafeResolve()

> **useSafeResolve**\<`TData`\>(`connection`, `domain`, `options?`): `UseQueryResult`\<`NoInfer`\<`TData`\>, `Error`\>

Defined in: [react/src/hooks/useSafeResolve/index.ts:27](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/react/src/hooks/useSafeResolve/index.ts#L27)

Resolves a `.sns` or `.sol` domain through the JavaScript SDK's `safeResolve`.
For `.sol` domains, the SRS target and corresponding `.sns` target must
match.

## Type Parameters

### TData

`TData` = `PublicKey`

## Parameters

### connection

`Connection`

Solana RPC connection

### domain

`string` \| `null` \| `undefined`

Full `.sns` or `.sol` domain name, or a nullish value to disable the automatic query

### options?

[`Options`](../../Types/type-aliases/Options.md)\<`PublicKey`, `TData`\> = `{}`

Optional React Query settings

## Returns

`UseQueryResult`\<`NoInfer`\<`TData`\>, `Error`\>

React Query result where `data` is the resolved `PublicKey` unless
transformed by `select`; failures populate `error` and set `isError` without
throwing during render.

## Example

```tsx
const { data: address } = useSafeResolve(connection, "example.sns");
```
