---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / ValidateEthereumSignatureInstructionParams

# Interface: ValidateEthereumSignatureInstructionParams

Defined in: [instructions/validateEthereumSignatureInstruction.ts:18](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/validateEthereumSignatureInstruction.ts#L18)

Input for validating an Ethereum signature for an SNS record.

## Example

```ts
const params: ValidateEthereumSignatureInstructionParams = { validation, signature, expectedPubkey };
```

## Properties

### expectedPubkey

> **expectedPubkey**: `ReadonlyUint8Array`

Defined in: [instructions/validateEthereumSignatureInstruction.ts:24](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/validateEthereumSignatureInstruction.ts#L24)

Expected Ethereum public key.

***

### signature

> **signature**: `ReadonlyUint8Array`

Defined in: [instructions/validateEthereumSignatureInstruction.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/validateEthereumSignatureInstruction.ts#L22)

Ethereum signature.

***

### validation

> **validation**: `number`

Defined in: [instructions/validateEthereumSignatureInstruction.ts:20](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/validateEthereumSignatureInstruction.ts#L20)

Validation mode discriminator.
