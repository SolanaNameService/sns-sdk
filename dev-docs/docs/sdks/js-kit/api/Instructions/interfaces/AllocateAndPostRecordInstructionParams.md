---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / AllocateAndPostRecordInstructionParams

# Interface: AllocateAndPostRecordInstructionParams

Defined in: [instructions/allocateAndPostRecordInstruction.ts:18](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/instructions/allocateAndPostRecordInstruction.ts#L18)

Input for allocating and writing an SNS V2 record.

## Example

```ts
const params: AllocateAndPostRecordInstructionParams = { record, content };
```

## Properties

### content

> **content**: `ReadonlyUint8Array`

Defined in: [instructions/allocateAndPostRecordInstruction.ts:22](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/instructions/allocateAndPostRecordInstruction.ts#L22)

Serialized record content.

***

### record

> **record**: `string`

Defined in: [instructions/allocateAndPostRecordInstruction.ts:20](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/instructions/allocateAndPostRecordInstruction.ts#L20)

Encoded V2 record label.
