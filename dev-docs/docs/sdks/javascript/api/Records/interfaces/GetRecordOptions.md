---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Records](../index.md) / GetRecordOptions

# Interface: GetRecordOptions

Defined in: [record/getRecord.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/record/getRecord.ts#L22)

Options controlling content decoding for [getRecord](../functions/getRecord.md).

## Example

```ts
const options: GetRecordOptions = { deserialize: true };
```

## Properties

### deserialize?

> `optional` **deserialize?**: `boolean`

Defined in: [record/getRecord.ts:24](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/record/getRecord.ts#L24)

Whether to deserialize the returned record content.
