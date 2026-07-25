---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / AllocateAndPostRecordInstructionParams

# Interface: AllocateAndPostRecordInstructionParams

Defined in: [instructions/allocateAndPostRecordInstruction.ts:18](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/allocateAndPostRecordInstruction.ts#L18)

Input for allocating and writing an SNS V2 record.

## Example

```ts
const params: AllocateAndPostRecordInstructionParams = { record, content };
```

## Properties

### content

> **content**: `ReadonlyUint8Array`

Defined in: [instructions/allocateAndPostRecordInstruction.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/allocateAndPostRecordInstruction.ts#L22)

Serialized record content.

***

### record

> **record**: `string`

Defined in: [instructions/allocateAndPostRecordInstruction.ts:20](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/allocateAndPostRecordInstruction.ts#L20)

Encoded V2 record label.
