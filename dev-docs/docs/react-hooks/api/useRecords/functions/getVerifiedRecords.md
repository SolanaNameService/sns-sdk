---
displayed_sidebar: docsSidebar
---

[React Hooks API Reference](../../index.md) / [useRecords](../index.md) / getVerifiedRecords

# Function: getVerifiedRecords()

> **getVerifiedRecords**(`connection`, `domain`, `records`, `deserialize?`): `Promise`\<[`VerifiedRecordResult`](../type-aliases/VerifiedRecordResult.md)[]\>

Defined in: [react/src/hooks/useRecords/index.ts:55](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/react/src/hooks/useRecords/index.ts#L55)

Retrieves records and removes entries that fail verification.

The output preserves the order of `records`. Missing records, stale records,
and records that fail an applicable right-of-association check are returned
as `undefined`.

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

### deserialize?

`boolean` = `false`

Whether to deserialize record content

## Returns

`Promise`\<[`VerifiedRecordResult`](../type-aliases/VerifiedRecordResult.md)[]\>

Verified record results in the same order as `records`

When used as a query function, rejected record retrieval is exposed through
the query result's `error` and `isError` fields.

## Example

```ts
const records = await getVerifiedRecords(connection, "example.sns", [Record.Url]);
```
