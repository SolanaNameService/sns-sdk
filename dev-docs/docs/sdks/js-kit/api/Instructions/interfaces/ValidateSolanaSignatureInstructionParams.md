---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / ValidateSolanaSignatureInstructionParams

# Interface: ValidateSolanaSignatureInstructionParams

Defined in: [instructions/validateSolanaSignatureInstruction.ts:12](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/instructions/validateSolanaSignatureInstruction.ts#L12)

Input for validating a Solana signature for an SNS record.

## Example

```ts
const params: ValidateSolanaSignatureInstructionParams = { staleness: false };
```

## Properties

### staleness

> **staleness**: `boolean`

Defined in: [instructions/validateSolanaSignatureInstruction.ts:14](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/instructions/validateSolanaSignatureInstruction.ts#L14)

Whether to validate staleness.
