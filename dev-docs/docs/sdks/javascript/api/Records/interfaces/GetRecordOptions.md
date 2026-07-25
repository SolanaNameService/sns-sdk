---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Records](../index.md) / GetRecordOptions

# Interface: GetRecordOptions

Defined in: [record/getRecord.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/record/getRecord.ts#L22)

Options controlling content decoding for [getRecord](../functions/getRecord.md).

## Example

```ts
const options: GetRecordOptions = { deserialize: true };
```

## Properties

### deserialize?

> `optional` **deserialize?**: `boolean`

Defined in: [record/getRecord.ts:24](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/record/getRecord.ts#L24)

Whether to deserialize the returned record content.
