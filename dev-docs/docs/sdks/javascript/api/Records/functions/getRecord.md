---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Records](../index.md) / getRecord

# Function: getRecord()

> **getRecord**(`connection`, `domain`, `record`, `options?`): `Promise`\<[`RecordResult`](../interfaces/RecordResult.md)\>

Defined in: [record/getRecord.ts:120](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/record/getRecord.ts#L120)

Retrieves a record for a domain, verifies its staleness and right of
association, and optionally deserializes the record content.

## Parameters

### connection

`Connection`

Solana RPC connection

### domain

`string`

Full `.sns` or `.sol` domain name

### record

[`Record`](../enumerations/Record.md)

Record type to retrieve

### options?

[`GetRecordOptions`](../interfaces/GetRecordOptions.md) = `{}`

Optional retrieval settings

## Returns

`Promise`\<[`RecordResult`](../interfaces/RecordResult.md)\>

The requested record, verification results, and optional decoded content

## Example

```ts
const record = await getRecord(connection, "name.sns", Record.Url, {
  deserialize: true,
});
```
