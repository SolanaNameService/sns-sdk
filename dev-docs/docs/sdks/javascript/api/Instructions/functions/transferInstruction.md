---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Instructions](../index.md) / transferInstruction

# Function: transferInstruction()

> **transferInstruction**(`nameProgramId`, `nameAccountKey`, `newOwnerKey`, `currentNameOwnerKey`, `nameClassKey?`, `nameParent?`, `parentOwner?`): `TransactionInstruction`

Defined in: [instructions/transferInstruction.ts:21](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/instructions/transferInstruction.ts#L21)

Builds an SPL Name Service instruction that transfers a name registry owner.

## Parameters

### nameProgramId

`PublicKey`

SPL Name Service program address.

### nameAccountKey

`PublicKey`

Registry address whose owner changes.

### newOwnerKey

`PublicKey`

Public key that becomes the registry owner.

### currentNameOwnerKey

`PublicKey`

Current registry owner and default required signer.

### nameClassKey?

`PublicKey`

Optional class authority signer.

### nameParent?

`PublicKey`

Optional parent registry address.

### parentOwner?

`PublicKey`

Optional parent owner signer used instead of the current owner.

## Returns

`TransactionInstruction`

A transaction instruction that transfers registry ownership.

## Example

```ts
const instruction = transferInstruction(nameProgramId, nameAccount, newOwner, currentOwner);
```
