---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Records](../index.md) / getMultipleRecords

# Function: getMultipleRecords()

> **getMultipleRecords**(`connection`, `domain`, `records`, `options?`): `Promise`\<([`RecordResult`](../interfaces/RecordResult.md) \| `undefined`)[]\>

Defined in: [record/getMultipleRecords.ts:45](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/record/getMultipleRecords.ts#L45)

Retrieves multiple records for a domain, verifies the staleness and right
of association of each, and optionally deserializes their content.

## Parameters

### connection

`Connection`

Solana RPC connection

### domain

`string`

Full `.sns` or `.sol` domain name

### records

[`Record`](../enumerations/Record.md)[]

Record types to retrieve

### options?

[`GetMultipleRecordsOptions`](../interfaces/GetMultipleRecordsOptions.md) = `{}`

Optional retrieval settings.

## Returns

`Promise`\<([`RecordResult`](../interfaces/RecordResult.md) \| `undefined`)[]\>

An array of results in the same order as `records`. Each entry
contains the record type, the raw SNS record account, staleness and
right-of-association verification results, and optionally the deserialized
content. Entries are `undefined` for records that do not exist on-chain.

## Example

```ts
const records = await getMultipleRecords(connection, "example.sns", [Record.Url]);
```
