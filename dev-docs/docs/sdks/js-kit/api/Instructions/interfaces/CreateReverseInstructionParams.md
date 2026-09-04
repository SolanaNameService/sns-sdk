---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / CreateReverseInstructionParams

# Interface: CreateReverseInstructionParams

Defined in: [instructions/createReverseInstruction.ts:12](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/instructions/createReverseInstruction.ts#L12)

Input for creating an SNS reverse-lookup account.

## Example

```ts
const params: CreateReverseInstructionParams = { domain: "example" };
```

## Properties

### domain

> **domain**: `string`

Defined in: [instructions/createReverseInstruction.ts:14](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/instructions/createReverseInstruction.ts#L14)

Raw reverse lookup payload.
