---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / UpdateRecordInstructionParams

# Interface: UpdateRecordInstructionParams

Defined in: [instructions/updateRecordInstruction.ts:18](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/updateRecordInstruction.ts#L18)

Input for updating an SNS V2 record account.

## Example

```ts
const params: UpdateRecordInstructionParams = { record, content };
```

## Properties

### content

> **content**: `ReadonlyUint8Array`

Defined in: [instructions/updateRecordInstruction.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/updateRecordInstruction.ts#L22)

Serialized record content.

***

### record

> **record**: `string`

Defined in: [instructions/updateRecordInstruction.ts:20](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/updateRecordInstruction.ts#L20)

Encoded V2 record label.
