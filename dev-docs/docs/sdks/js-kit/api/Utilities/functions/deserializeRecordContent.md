---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / deserializeRecordContent

# Function: deserializeRecordContent()

> **deserializeRecordContent**(`params`): `string`

Defined in: [utils/deserializers/deserializeRecordContent.ts:51](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/utils/deserializers/deserializeRecordContent.ts#L51)

Deserializes record content according to SNS-IP 1.

`CNAME` and `TXT` content is punycode-decoded after UTF-8 deserialization.

## Parameters

### params

[`DeserializeRecordContentParams`](../interfaces/DeserializeRecordContentParams.md)

Record deserialization parameters

## Returns

`string`

Deserialized record content.

## Throws

InvalidRecordDataError If the record type or content is unsupported.

## Example

```ts
const result = await getDomainRecord({
  rpc,
  domain: "example.sns",
  record: Record.Url,
});
const content = deserializeRecordContent({
  content: result.retrievedRecord.getContent(),
  record: Record.Url,
});
```
