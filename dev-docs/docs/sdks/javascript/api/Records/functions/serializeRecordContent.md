---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Records](../index.md) / serializeRecordContent

# Function: serializeRecordContent()

> **serializeRecordContent**(`content`, `record`): `Buffer`

Defined in: [record/serializeRecordContent.ts:31](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/record/serializeRecordContent.ts#L31)

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
