---
displayed_sidebar: docsSidebar
---

[React Hooks API Reference](../../index.md) / [useRecords](../index.md) / UseRecordsOptions

# Interface: UseRecordsOptions

Defined in: [react/src/hooks/useRecords/index.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/react/src/hooks/useRecords/index.ts#L26)

Options for [useRecords](../functions/useRecords.md).

## Example

```ts
const options: UseRecordsOptions = { deserialize: true };
```

## Properties

### deserialize?

> `optional` **deserialize?**: `boolean`

Defined in: [react/src/hooks/useRecords/index.ts:28](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/react/src/hooks/useRecords/index.ts#L28)

Whether to deserialize record content according to its SNS record type.
