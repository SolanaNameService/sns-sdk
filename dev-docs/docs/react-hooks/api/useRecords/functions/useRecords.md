---
displayed_sidebar: docsSidebar
---

[React Hooks API Reference](../../index.md) / [useRecords](../index.md) / useRecords

# Function: useRecords()

> **useRecords**\<`TData`\>(`connection`, `domain`, `records`, `options?`, `queryOptions?`): `UseQueryResult`\<`NoInfer`\<`TData`\>, `Error`\>

Defined in: [react/src/hooks/useRecords/index.ts:94](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/react/src/hooks/useRecords/index.ts#L94)

Retrieves and verifies multiple records through React Query.

## Type Parameters

### TData

`TData` = [`VerifiedRecordResult`](../type-aliases/VerifiedRecordResult.md)[]

## Parameters

### connection

`Connection`

Solana RPC connection

### domain

`string`

Canonical lowercase `.sns` domain name, including a top-level
domain or one-level subdomain

### records

`Record`[]

Record types to retrieve

### options?

[`UseRecordsOptions`](../interfaces/UseRecordsOptions.md) = `{}`

Optional JavaScript SDK record retrieval settings

### queryOptions?

[`Options`](../../Types/type-aliases/Options.md)\<[`VerifiedRecordResult`](../type-aliases/VerifiedRecordResult.md)[], `TData`\> = `{}`

Optional React Query settings

## Returns

`UseQueryResult`\<`NoInfer`\<`TData`\>, `Error`\>

React Query result where `data` preserves the `records` order and
uses `undefined` for missing or unverified entries; `isPending` tracks the
initial request, while failures populate `error` and set `isError` without
throwing during render.

Query failures are exposed through the result's `error` and `isError` fields.
`.sol` names fail with `UnsupportedTldError`; malformed names fail with
`InvalidDomainError` before account RPC requests.

## Example

```tsx
const { data, isError } = useRecords(connection, "example.sns", [Record.Url]);
```
