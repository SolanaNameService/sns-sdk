---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / TransferInstructionParams

# Interface: TransferInstructionParams

Defined in: [instructions/transferInstruction.ts:21](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/transferInstruction.ts#L21)

Input for transferring an SNS name-registry account.

## Example

```ts
const params: TransferInstructionParams = { newOwner };
```

## Properties

### newOwner

> **newOwner**: `Address`

Defined in: [instructions/transferInstruction.ts:23](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/transferInstruction.ts#L23)

New registry owner.
