---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / DeserializeRecordContentParams

# Interface: DeserializeRecordContentParams

Defined in: [utils/deserializers/deserializeRecordContent.ts:20](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/utils/deserializers/deserializeRecordContent.ts#L20)

Parameters for deserializing record content.

## Example

```ts
const params: DeserializeRecordContentParams = { content, record: Record.Url };
```

## Properties

### content

> **content**: `ReadonlyUint8Array`

Defined in: [utils/deserializers/deserializeRecordContent.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/utils/deserializers/deserializeRecordContent.ts#L22)

Serialized record content.

***

### record

> **record**: [`Record`](../../Types/enumerations/Record.md)

Defined in: [utils/deserializers/deserializeRecordContent.ts:24](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/utils/deserializers/deserializeRecordContent.ts#L24)

Record type.
