---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / SerializeRecordContentParams

# Interface: SerializeRecordContentParams

Defined in: [utils/serializers/serializeRecordContent.ts:32](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/utils/serializers/serializeRecordContent.ts#L32)

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

Defined in: [utils/serializers/serializeRecordContent.ts:34](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/utils/serializers/serializeRecordContent.ts#L34)

Record content.

***

### record

> **record**: [`Record`](../../Types/enumerations/Record.md)

Defined in: [utils/serializers/serializeRecordContent.ts:36](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/utils/serializers/serializeRecordContent.ts#L36)

Record type.
