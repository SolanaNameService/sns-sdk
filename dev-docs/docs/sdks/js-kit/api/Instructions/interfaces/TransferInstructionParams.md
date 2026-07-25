---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / TransferInstructionParams

# Interface: TransferInstructionParams

Defined in: [instructions/transferInstruction.ts:21](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/transferInstruction.ts#L21)

Input for transferring an SNS name-registry account.

## Example

```ts
const params: TransferInstructionParams = { newOwner };
```

## Properties

### newOwner

> **newOwner**: `Address`

Defined in: [instructions/transferInstruction.ts:23](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/transferInstruction.ts#L23)

New registry owner.
