---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Instructions](../index.md) / reallocInstruction

# Function: reallocInstruction()

> **reallocInstruction**(`nameProgramId`, `systemProgramId`, `payerKey`, `nameAccountKey`, `nameOwnerKey`, `space`): `TransactionInstruction`

Defined in: [instructions/reallocInstruction.ts:28](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/instructions/reallocInstruction.ts#L28)

Builds an SPL Name Service instruction that resizes a name registry account.

## Parameters

### nameProgramId

`PublicKey`

SPL Name Service program address.

### systemProgramId

`PublicKey`

System Program address used for reallocation.

### payerKey

`PublicKey`

Signer that funds the additional account rent.

### nameAccountKey

`PublicKey`

Registry address to resize.

### nameOwnerKey

`PublicKey`

Signer authorized to resize the registry.

### space

[`Numberu32`](../../Integer-utilities/classes/Numberu32.md)

New registry data size in bytes.

## Returns

`TransactionInstruction`

A transaction instruction that resizes the name registry.

## Example

```ts
const instruction = reallocInstruction(
  nameProgramId,
  systemProgramId,
  payer,
  nameAccount,
  owner,
  space,
);
```
