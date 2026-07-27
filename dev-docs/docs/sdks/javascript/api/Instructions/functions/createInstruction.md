---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Instructions](../index.md) / createInstruction

# Function: createInstruction()

> **createInstruction**(`nameProgramId`, `systemProgramId`, `nameKey`, `nameOwnerKey`, `payerKey`, `hashed_name`, `lamports`, `space`, `nameClassKey?`, `nameParent?`, `nameParentOwner?`): `TransactionInstruction`

Defined in: [instructions/createInstruction.ts:28](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/instructions/createInstruction.ts#L28)

Builds an SPL Name Service instruction that creates a name registry account.

## Parameters

### nameProgramId

`PublicKey`

SPL Name Service program address.

### systemProgramId

`PublicKey`

System Program address used to create the account.

### nameKey

`PublicKey`

Derived address of the registry to create.

### nameOwnerKey

`PublicKey`

Public key that will own the registry.

### payerKey

`PublicKey`

Signer that funds account creation.

### hashed\_name

`Buffer`

Hashed name bytes stored by the registry.

### lamports

[`Numberu64`](../../Integer-utilities/classes/Numberu64.md)

Rent-exempt lamports to allocate to the registry.

### space

[`Numberu32`](../../Integer-utilities/classes/Numberu32.md)

Number of bytes allocated for the registry data.

### nameClassKey?

`PublicKey`

Optional class authority required to create the registry.

### nameParent?

`PublicKey`

Optional parent registry address.

### nameParentOwner?

`PublicKey`

Optional signer that owns the parent registry.

## Returns

`TransactionInstruction`

A transaction instruction that creates the name registry.

## Example

```ts
const instruction = createInstruction(
  nameProgramId, systemProgramId, nameKey, owner, payer, hashedName, lamports, space,
);
```
