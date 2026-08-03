---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / ReallocInstructionParams

# Interface: ReallocInstructionParams

Defined in: [instructions/reallocInstruction.ts:12](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/reallocInstruction.ts#L12)

Input for reallocating an SNS name-registry account.

## Example

```ts
const params: ReallocInstructionParams = { space: 1_000 };
```

## Properties

### space

> **space**: `number`

Defined in: [instructions/reallocInstruction.ts:14](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/reallocInstruction.ts#L14)

New account data size in bytes.
