---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Instructions](../index.md) / SetPrimaryInstruction

# Class: SetPrimaryInstruction

Defined in: [instructions/setPrimaryInstruction.ts:7](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/instructions/setPrimaryInstruction.ts#L7)

Serializable registrar instruction for setting a wallet primary domain.

## Constructors

### Constructor

> **new SetPrimaryInstruction**(): `SetPrimaryInstruction`

Defined in: [instructions/setPrimaryInstruction.ts:15](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/instructions/setPrimaryInstruction.ts#L15)

#### Returns

`SetPrimaryInstruction`

## Properties

### tag

> **tag**: `number`

Defined in: [instructions/setPrimaryInstruction.ts:9](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/instructions/setPrimaryInstruction.ts#L9)

Instruction discriminator.

***

### schema

> `static` **schema**: `object`

Defined in: [instructions/setPrimaryInstruction.ts:10](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/instructions/setPrimaryInstruction.ts#L10)

#### struct

> **struct**: `object`

##### struct.tag

> **tag**: `string` = `"u8"`

## Methods

### getInstruction()

> **getInstruction**(`programId`, `nameAccount`, `primaryAccount`, `owner`, `systemProgram`, `optParent?`): `TransactionInstruction`

Defined in: [instructions/setPrimaryInstruction.ts:23](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/instructions/setPrimaryInstruction.ts#L23)

Builds the transaction instruction with the required primary-domain accounts.

#### Parameters

##### programId

`PublicKey`

##### nameAccount

`PublicKey`

##### primaryAccount

`PublicKey`

##### owner

`PublicKey`

##### systemProgram

`PublicKey`

##### optParent?

`PublicKey`

#### Returns

`TransactionInstruction`

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [instructions/setPrimaryInstruction.ts:19](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/instructions/setPrimaryInstruction.ts#L19)

Serializes the registrar instruction payload.

#### Returns

`Uint8Array`
