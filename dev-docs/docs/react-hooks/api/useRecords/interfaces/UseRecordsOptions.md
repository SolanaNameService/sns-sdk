---
displayed_sidebar: docsSidebar
---

[React Hooks API Reference](../../index.md) / [useRecords](../index.md) / UseRecordsOptions

# Interface: UseRecordsOptions

Defined in: [react/src/hooks/useRecords/index.ts:26](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/react/src/hooks/useRecords/index.ts#L26)

Options for [useRecords](../functions/useRecords.md).

## Example

```ts
const options: UseRecordsOptions = { deserialize: true };
```

## Properties

### deserialize?

> `optional` **deserialize?**: `boolean`

Defined in: [react/src/hooks/useRecords/index.ts:28](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/react/src/hooks/useRecords/index.ts#L28)

Whether to deserialize record content according to its SNS record type.
