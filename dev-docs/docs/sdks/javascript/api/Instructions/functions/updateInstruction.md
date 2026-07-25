---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Instructions](../index.md) / updateInstruction

# Function: updateInstruction()

> **updateInstruction**(`nameProgramId`, `nameAccountKey`, `offset`, `inputData`, `nameUpdateSigner`): `TransactionInstruction`

Defined in: [instructions/updateInstruction.ts:20](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/instructions/updateInstruction.ts#L20)

Builds an SPL Name Service instruction that writes bytes to a name registry.

## Parameters

### nameProgramId

`PublicKey`

SPL Name Service program address.

### nameAccountKey

`PublicKey`

Registry address to update.

### offset

[`Numberu32`](../../Integer-utilities/classes/Numberu32.md)

Byte offset at which to begin writing.

### inputData

`Buffer`

Bytes written to the account.

### nameUpdateSigner

`PublicKey`

Signer authorized to update the registry.

## Returns

`TransactionInstruction`

A transaction instruction that writes the supplied bytes.

## Example

```ts
const instruction = updateInstruction(nameProgramId, nameAccount, offset, data, updateSigner);
```
