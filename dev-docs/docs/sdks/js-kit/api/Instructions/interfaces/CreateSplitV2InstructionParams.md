---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / CreateSplitV2InstructionParams

# Interface: CreateSplitV2InstructionParams

Defined in: [instructions/createSplitV2Instruction.ts:12](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/createSplitV2Instruction.ts#L12)

Input for creating a split SNS V2 domain account.

## Example

```ts
const params: CreateSplitV2InstructionParams = { name: "example", space: 1_000, referrerIdxOpt: null };
```

## Properties

### name

> **name**: `string`

Defined in: [instructions/createSplitV2Instruction.ts:14](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/createSplitV2Instruction.ts#L14)

TLD-less domain name.

***

### referrerIdxOpt

> **referrerIdxOpt**: `number` \| `null`

Defined in: [instructions/createSplitV2Instruction.ts:18](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/createSplitV2Instruction.ts#L18)

Approved referrer index, if any.

***

### space

> **space**: `number`

Defined in: [instructions/createSplitV2Instruction.ts:16](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/createSplitV2Instruction.ts#L16)

Account data size in bytes.
