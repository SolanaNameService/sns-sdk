---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / SetRecordRoaVerifierInstructionParams

# Interface: SetRecordRoaVerifierInstructionParams

Defined in: [instructions/setRecordRoaVerifierInstruction.ts:20](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/setRecordRoaVerifierInstruction.ts#L20)

Input for setting an SNS record's Right of Association verifier.

## Example

```ts
const params: SetRecordRoaVerifierInstructionParams = { verifier };
```

## Properties

### verifier

> **verifier**: `Address`

Defined in: [instructions/setRecordRoaVerifierInstruction.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/setRecordRoaVerifierInstruction.ts#L22)

Verifier account address.
