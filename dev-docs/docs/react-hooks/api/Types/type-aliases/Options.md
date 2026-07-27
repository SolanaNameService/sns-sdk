---
displayed_sidebar: docsSidebar
---

[React Hooks API Reference](../../index.md) / [Types](../index.md) / Options

# Type Alias: Options\<TQueryFnData, TData, TError\>

> **Options**\<`TQueryFnData`, `TData`, `TError`\> = `Omit`\<`UseQueryOptions`\<`TQueryFnData`, `TError`, `TData`, `QueryKey`\>, `"queryFn"` \| `"queryKey"`\> & `object`

Defined in: [react/src/types.ts:12](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/react/src/types.ts#L12)

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
