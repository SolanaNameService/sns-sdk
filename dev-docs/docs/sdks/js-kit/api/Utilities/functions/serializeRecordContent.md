---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / serializeRecordContent

# Function: serializeRecordContent()

> **serializeRecordContent**(`params`): `ReadonlyUint8Array`

Defined in: [utils/serializers/serializeRecordContent.ts:59](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/utils/serializers/serializeRecordContent.ts#L59)

Serializes record content according to SNS-IP 1.

`CNAME` and `TXT` content is punycode-encoded before UTF-8 serialization.

## Parameters

### params

[`SerializeRecordContentParams`](../interfaces/SerializeRecordContentParams.md)

Record serialization parameters

## Returns

`ReadonlyUint8Array`

Serialized record content.

## Throws

InvalidEvmAddressError, InvalidInjectiveAddressError, InvalidARecordError,
InvalidAAAARecordError, or InvalidRecordInputError when the record content is invalid or unsupported.

## Example

```ts
const content = serializeRecordContent({
  content: "https://example.com",
  record: Record.Url,
});
```
