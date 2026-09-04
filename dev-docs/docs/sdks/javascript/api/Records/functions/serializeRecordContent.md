---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Records](../index.md) / serializeRecordContent

# Function: serializeRecordContent()

> **serializeRecordContent**(`content`, `record`): `Buffer`

Defined in: [record/serializeRecordContent.ts:31](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/record/serializeRecordContent.ts#L31)

Serializes record content according to SNS-IP 1.

## Parameters

### content

`string`

Record content

### record

[`Record`](../enumerations/Record.md)

Record type

## Returns

`Buffer`

Serialized record content.

## Example

```ts
const bytes = serializeRecordContent("https://example.com", Record.Url);
```
