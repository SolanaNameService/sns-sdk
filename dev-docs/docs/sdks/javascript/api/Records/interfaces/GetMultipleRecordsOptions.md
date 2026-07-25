---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Records](../index.md) / GetMultipleRecordsOptions

# Interface: GetMultipleRecordsOptions

Defined in: [record/getMultipleRecords.ts:21](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/record/getMultipleRecords.ts#L21)

Options controlling content decoding for [getMultipleRecords](../functions/getMultipleRecords.md).

## Example

```ts
const options: GetMultipleRecordsOptions = { deserialize: true };
```

## Properties

### deserialize?

> `optional` **deserialize?**: `boolean`

Defined in: [record/getMultipleRecords.ts:23](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/record/getMultipleRecords.ts#L23)

Whether to deserialize each record's content.
