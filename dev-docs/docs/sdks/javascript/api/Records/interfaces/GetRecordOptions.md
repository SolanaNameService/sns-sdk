---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Records](../index.md) / GetRecordOptions

# Interface: GetRecordOptions

Defined in: [record/getRecord.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/record/getRecord.ts#L22)

Options controlling content decoding for [getRecord](../functions/getRecord.md).

## Example

```ts
const options: GetRecordOptions = { deserialize: true };
```

## Properties

### deserialize?

> `optional` **deserialize?**: `boolean`

Defined in: [record/getRecord.ts:24](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/record/getRecord.ts#L24)

Whether to deserialize the returned record content.
