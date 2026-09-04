---
displayed_sidebar: docsSidebar
---

[React Hooks API Reference](../../index.md) / [Types](../index.md) / Options

# Type Alias: Options\<TQueryFnData, TData, TError\>

> **Options**\<`TQueryFnData`, `TData`, `TError`\> = `Omit`\<`UseQueryOptions`\<`TQueryFnData`, `TError`, `TData`, `QueryKey`\>, `"queryFn"` \| `"queryKey"`\> & `object`

Defined in: [react/src/types.ts:12](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/react/src/types.ts#L12)

React Query options supported by SNS React hooks.

`TData` remains caller-selectable through React Query's `select` option.

## Type Declaration

### queryKey?

> `optional` **queryKey?**: `QueryKey`

Optional override for the hook's generated query key.

## Type Parameters

### TQueryFnData

`TQueryFnData` = `unknown`

### TData

`TData` = `TQueryFnData`

### TError

`TError` = `Error`
