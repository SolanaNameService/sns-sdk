---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Instructions](../index.md) / CreateSplitV2InstructionParams

# Interface: CreateSplitV2InstructionParams

Defined in: [instructions/createSplitV2Instruction.ts:14](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/instructions/createSplitV2Instruction.ts#L14)

Input for paid V2 domain registration.

## Example

```ts
const params: CreateSplitV2InstructionParams = { name: "example", space: 1_000, referrerIdxOpt: null };
```

## Properties

### name

> **name**: `string`

Defined in: [instructions/createSplitV2Instruction.ts:16](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/instructions/createSplitV2Instruction.ts#L16)

TLD-less domain name.

***

### referrerIdxOpt

> **referrerIdxOpt**: `number` \| `null`

Defined in: [instructions/createSplitV2Instruction.ts:20](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/instructions/createSplitV2Instruction.ts#L20)

Approved referrer index, if any.

***

### space

> **space**: `number`

Defined in: [instructions/createSplitV2Instruction.ts:18](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/instructions/createSplitV2Instruction.ts#L18)

Account data size in bytes.
