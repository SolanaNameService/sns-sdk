---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Records](../index.md) / getMultipleRecords

# Function: getMultipleRecords()

> **getMultipleRecords**(`connection`, `domain`, `records`, `options?`): `Promise`\<([`RecordResult`](../interfaces/RecordResult.md) \| `undefined`)[]\>

Defined in: [record/getMultipleRecords.ts:47](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/record/getMultipleRecords.ts#L47)

Retrieves multiple records for a `.sns` domain, verifies the staleness and right
of association of each, and optionally deserializes their content.

## Parameters

### connection

`Connection`

Solana RPC connection

### domain

`string`

Full `.sns` domain name

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

## Throws

[Errors.UnsupportedTldError](../../Errors/classes/UnsupportedTldError.md) when the domain lacks a `.sns` suffix;
[Errors.InvalidDomainError](../../Errors/classes/InvalidDomainError.md) when the `.sns` domain or subdomain is invalid.

## Example

```ts
const records = await getMultipleRecords(connection, "example.sns", [Record.Url]);
```
