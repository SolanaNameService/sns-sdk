---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Instructions](../index.md) / CreateReverseInstruction

# Class: CreateReverseInstruction

Defined in: [instructions/createReverseInstruction.ts:20](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/instructions/createReverseInstruction.ts#L20)

Serializable registrar instruction for creating a reverse-lookup registry.

## Constructors

### Constructor

> **new CreateReverseInstruction**(`obj`): `CreateReverseInstruction`

Defined in: [instructions/createReverseInstruction.ts:32](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/instructions/createReverseInstruction.ts#L32)

#### Parameters

##### obj

[`CreateReverseInstructionParams`](../interfaces/CreateReverseInstructionParams.md)

#### Returns

`CreateReverseInstruction`

## Properties

### name

> **name**: `string`

Defined in: [instructions/createReverseInstruction.ts:24](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/instructions/createReverseInstruction.ts#L24)

Raw reverse lookup payload.

***

### tag

> **tag**: `number`

Defined in: [instructions/createReverseInstruction.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/instructions/createReverseInstruction.ts#L22)

Instruction discriminator.

***

### schema

> `static` **schema**: `object`

Defined in: [instructions/createReverseInstruction.ts:25](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/instructions/createReverseInstruction.ts#L25)

#### struct

> **struct**: `object`

##### struct.name

> **name**: `string` = `"string"`

##### struct.tag

> **tag**: `string` = `"u8"`

## Methods

### getInstruction()

> **getInstruction**(`programId`, `namingServiceProgram`, `rootDomain`, `reverseLookup`, `systemProgram`, `centralState`, `feePayer`, `rentSysvar`, `parentName?`, `parentNameOwner?`): `TransactionInstruction`

Defined in: [instructions/createReverseInstruction.ts:41](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/instructions/createReverseInstruction.ts#L41)

Builds the transaction instruction with the required reverse-registry accounts.

#### Parameters

##### programId

`PublicKey`

##### namingServiceProgram

`PublicKey`

##### rootDomain

`PublicKey`

##### reverseLookup

`PublicKey`

##### systemProgram

`PublicKey`

##### centralState

`PublicKey`

##### feePayer

`PublicKey`

##### rentSysvar

`PublicKey`

##### parentName?

`PublicKey`

##### parentNameOwner?

`PublicKey`

#### Returns

`TransactionInstruction`

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [instructions/createReverseInstruction.ts:37](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/instructions/createReverseInstruction.ts#L37)

Serializes the registrar instruction payload.

#### Returns

`Uint8Array`
