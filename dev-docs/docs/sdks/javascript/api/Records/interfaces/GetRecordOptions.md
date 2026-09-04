---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Records](../index.md) / GetRecordOptions

# Interface: GetRecordOptions

Defined in: [record/getRecord.ts:22](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/record/getRecord.ts#L22)

Options controlling content decoding for [getRecord](../functions/getRecord.md).

## Example

```ts
const options: GetRecordOptions = { deserialize: true };
```

## Properties

### deserialize?

> `optional` **deserialize?**: `boolean`

Defined in: [record/getRecord.ts:24](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/record/getRecord.ts#L24)

Whether to deserialize the returned record content.
