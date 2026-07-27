---
displayed_sidebar: docsSidebar
---

[React Hooks API Reference](../../index.md) / [useSubdomains](../index.md) / useSubdomains

# Function: useSubdomains()

> **useSubdomains**\<`TData`\>(`connection`, `domain`, `options?`): `UseQueryResult`\<`NoInfer`\<`TData`\>, `Error`\>

Defined in: [react/src/hooks/useSubdomains/index.ts:30](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/react/src/hooks/useSubdomains/index.ts#L30)

Finds subdomains for an SNS parent domain through React Query.

## Type Parameters

### TData

`TData` = `string`[]

## Parameters

### connection

`Connection`

Solana RPC connection

### domain

`string`

TLD-trimmed SNS parent domain name, such as `example`

### options?

[`Options`](../../Types/type-aliases/Options.md)\<`string`[], `TData`\> = `{}`

Optional React Query settings

## Returns

`UseQueryResult`\<`NoInfer`\<`TData`\>, `Error`\>

React Query result where `data` contains human-readable subdomain
names; `isPending` tracks the initial request, while failures populate
`error` and set `isError` without throwing during render.

Query failures are exposed through the result's `error` and `isError` fields.

## Example

```tsx
const { data: subdomains } = useSubdomains(connection, "example");
```
