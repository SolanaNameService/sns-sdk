---
displayed_sidebar: docsSidebar
---

[React Hooks API Reference](../../index.md) / [useRecords](../index.md) / UseRecordsOptions

# Interface: UseRecordsOptions

Defined in: [react/src/hooks/useRecords/index.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/react/src/hooks/useRecords/index.ts#L26)

Options for [useRecords](../functions/useRecords.md).

## Example

```ts
const options: UseRecordsOptions = { deserialize: true };
```

## Properties

### deserialize?

> `optional` **deserialize?**: `boolean`

Defined in: [react/src/hooks/useRecords/index.ts:28](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/react/src/hooks/useRecords/index.ts#L28)

Whether to deserialize record content according to its SNS record type.
