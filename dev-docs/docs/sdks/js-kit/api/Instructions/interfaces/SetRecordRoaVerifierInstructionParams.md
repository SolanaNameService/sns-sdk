---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / SetRecordRoaVerifierInstructionParams

# Interface: SetRecordRoaVerifierInstructionParams

Defined in: [instructions/setRecordRoaVerifierInstruction.ts:20](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/instructions/setRecordRoaVerifierInstruction.ts#L20)

Input for setting an SNS record's Right of Association verifier.

## Example

```ts
const params: SetRecordRoaVerifierInstructionParams = { verifier };
```

## Properties

### verifier

> **verifier**: `Address`

Defined in: [instructions/setRecordRoaVerifierInstruction.ts:22](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/instructions/setRecordRoaVerifierInstruction.ts#L22)

Verifier account address.
