---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / SerializeRecordContentParams

# Interface: SerializeRecordContentParams

Defined in: [utils/serializers/serializeRecordContent.ts:32](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/utils/serializers/serializeRecordContent.ts#L32)

Parameters for serializing record content.

## Example

```ts
const params: SerializeRecordContentParams = {
  content: "https://example.com",
  record: Record.Url,
};
```

## Properties

### content

> **content**: `string`

Defined in: [utils/serializers/serializeRecordContent.ts:34](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/utils/serializers/serializeRecordContent.ts#L34)

Record content.

***

### record

> **record**: [`Record`](../../Types/enumerations/Record.md)

Defined in: [utils/serializers/serializeRecordContent.ts:36](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/utils/serializers/serializeRecordContent.ts#L36)

Record type.
