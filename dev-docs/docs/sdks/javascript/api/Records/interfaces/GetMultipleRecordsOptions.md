---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Records](../index.md) / GetMultipleRecordsOptions

# Interface: GetMultipleRecordsOptions

Defined in: [record/getMultipleRecords.ts:21](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/record/getMultipleRecords.ts#L21)

Options controlling content decoding for [getMultipleRecords](../functions/getMultipleRecords.md).

## Example

```ts
const options: GetMultipleRecordsOptions = { deserialize: true };
```

## Properties

### deserialize?

> `optional` **deserialize?**: `boolean`

Defined in: [record/getMultipleRecords.ts:23](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/record/getMultipleRecords.ts#L23)

Whether to deserialize each record's content.
