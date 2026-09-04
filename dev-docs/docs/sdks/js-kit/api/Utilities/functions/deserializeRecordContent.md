---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / deserializeRecordContent

# Function: deserializeRecordContent()

> **deserializeRecordContent**(`params`): `string`

Defined in: [utils/deserializers/deserializeRecordContent.ts:51](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/utils/deserializers/deserializeRecordContent.ts#L51)

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
