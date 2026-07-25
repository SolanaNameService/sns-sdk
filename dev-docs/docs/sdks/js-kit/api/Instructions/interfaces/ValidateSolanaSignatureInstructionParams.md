---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / ValidateSolanaSignatureInstructionParams

# Interface: ValidateSolanaSignatureInstructionParams

Defined in: [instructions/validateSolanaSignatureInstruction.ts:12](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/validateSolanaSignatureInstruction.ts#L12)

Input for validating a Solana signature for an SNS record.

## Example

```ts
const params: ValidateSolanaSignatureInstructionParams = { staleness: false };
```

## Properties

### staleness

> **staleness**: `boolean`

Defined in: [instructions/validateSolanaSignatureInstruction.ts:14](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/validateSolanaSignatureInstruction.ts#L14)

Whether to validate staleness.
