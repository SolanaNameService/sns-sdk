---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / ReallocInstructionParams

# Interface: ReallocInstructionParams

Defined in: [instructions/reallocInstruction.ts:12](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/instructions/reallocInstruction.ts#L12)

Input for reallocating an SNS name-registry account.

## Example

```ts
const params: ReallocInstructionParams = { space: 1_000 };
```

## Properties

### space

> **space**: `number`

Defined in: [instructions/reallocInstruction.ts:14](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/instructions/reallocInstruction.ts#L14)

New account data size in bytes.
