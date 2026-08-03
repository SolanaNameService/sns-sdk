---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Records](../index.md) / deserializeRecordContent

# Function: deserializeRecordContent()

> **deserializeRecordContent**(`content`, `record`): `string`

Defined in: [record/deserializeRecordContent.ts:34](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/record/deserializeRecordContent.ts#L34)

Deserializes record content according to SNS-IP 1.

## Parameters

### content

`Buffer`

Serialized record content

### record

[`Record`](../enumerations/Record.md)

Record type

## Returns

`string`

Deserialized record content.

## Example

```ts
const result = await getRecord(
  connection,
  "example.sns",
  Record.Url,
  { deserialize: false },
);
const url = deserializeRecordContent(
  result.retrievedRecord.getContent(),
  Record.Url,
);
```
