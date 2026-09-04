---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Records](../index.md) / getRecord

# Function: getRecord()

> **getRecord**(`connection`, `domain`, `record`, `options?`): `Promise`\<[`RecordResult`](../interfaces/RecordResult.md)\>

Defined in: [record/getRecord.ts:123](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/record/getRecord.ts#L123)

Retrieves a record for a `.sns` domain, verifies its staleness and right of
association, and optionally deserializes the record content.

## Parameters

### connection

`Connection`

Solana RPC connection

### domain

`string`

Full `.sns` domain name

### record

[`Record`](../enumerations/Record.md)

Record type to retrieve

### options?

[`GetRecordOptions`](../interfaces/GetRecordOptions.md) = `{}`

Optional retrieval settings

## Returns

`Promise`\<[`RecordResult`](../interfaces/RecordResult.md)\>

The requested record, verification results, and optional decoded content

## Throws

[Errors.UnsupportedTldError](../../Errors/classes/UnsupportedTldError.md) when the domain lacks a `.sns` suffix;
[Errors.InvalidDomainError](../../Errors/classes/InvalidDomainError.md) when the `.sns` domain or subdomain is invalid.

## Example

```ts
const record = await getRecord(connection, "name.sns", Record.Url, {
  deserialize: true,
});
```
