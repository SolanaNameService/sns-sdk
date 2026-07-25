---
displayed_sidebar: docsSidebar
---

[React Hooks API Reference](../../index.md) / [useRecords](../index.md) / useRecords

# Function: useRecords()

> **useRecords**\<`TData`\>(`connection`, `domain`, `records`, `options?`, `queryOptions?`): `UseQueryResult`\<`NoInfer`\<`TData`\>, `Error`\>

Defined in: [react/src/hooks/useRecords/index.ts:90](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/react/src/hooks/useRecords/index.ts#L90)

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

Full `.sns` or `.sol` domain name

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

## Example

```tsx
const { data, isError } = useRecords(connection, "example.sns", [Record.Url]);
```
