---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Records](../index.md) / GetMultipleRecordsOptions

# Interface: GetMultipleRecordsOptions

Defined in: [record/getMultipleRecords.ts:21](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/record/getMultipleRecords.ts#L21)

Options controlling content decoding for [getMultipleRecords](../functions/getMultipleRecords.md).

## Example

```ts
const options: GetMultipleRecordsOptions = { deserialize: true };
```

## Properties

### deserialize?

> `optional` **deserialize?**: `boolean`

Defined in: [record/getMultipleRecords.ts:23](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/record/getMultipleRecords.ts#L23)

Whether to deserialize each record's content.
