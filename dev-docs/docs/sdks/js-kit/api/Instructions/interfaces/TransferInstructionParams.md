---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / TransferInstructionParams

# Interface: TransferInstructionParams

Defined in: [instructions/transferInstruction.ts:21](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/instructions/transferInstruction.ts#L21)

Input for transferring an SNS name-registry account.

## Example

```ts
const params: TransferInstructionParams = { newOwner };
```

## Properties

### newOwner

> **newOwner**: `Address`

Defined in: [instructions/transferInstruction.ts:23](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/instructions/transferInstruction.ts#L23)

New registry owner.
