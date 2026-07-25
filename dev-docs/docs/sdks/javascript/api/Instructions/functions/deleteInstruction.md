---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Instructions](../index.md) / deleteInstruction

# Function: deleteInstruction()

> **deleteInstruction**(`nameProgramId`, `nameAccountKey`, `refundTargetKey`, `nameOwnerKey`): `TransactionInstruction`

Defined in: [instructions/deleteInstruction.ts:18](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/instructions/deleteInstruction.ts#L18)

Builds an SPL Name Service instruction that deletes a name registry account.

## Parameters

### nameProgramId

`PublicKey`

SPL Name Service program address.

### nameAccountKey

`PublicKey`

Registry address to delete.

### refundTargetKey

`PublicKey`

Account that receives the reclaimed lamports.

### nameOwnerKey

`PublicKey`

Signer authorized to delete the registry.

## Returns

`TransactionInstruction`

A transaction instruction that deletes the name registry.

## Example

```ts
const instruction = deleteInstruction(nameProgramId, nameAccount, refundTarget, owner);
```
