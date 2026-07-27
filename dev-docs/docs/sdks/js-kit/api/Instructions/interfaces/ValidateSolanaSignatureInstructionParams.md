---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / ValidateSolanaSignatureInstructionParams

# Interface: ValidateSolanaSignatureInstructionParams

Defined in: [instructions/validateSolanaSignatureInstruction.ts:12](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/validateSolanaSignatureInstruction.ts#L12)

Input for validating a Solana signature for an SNS record.

## Example

```ts
const params: ValidateSolanaSignatureInstructionParams = { staleness: false };
```

## Properties

### staleness

> **staleness**: `boolean`

Defined in: [instructions/validateSolanaSignatureInstruction.ts:14](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/validateSolanaSignatureInstruction.ts#L14)

Whether to validate staleness.
