---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Instructions](../index.md) / BurnInstruction

# Class: BurnInstruction

Defined in: [instructions/burnInstruction.ts:7](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/instructions/burnInstruction.ts#L7)

Serializable registrar instruction for burning a registered domain.

## Constructors

### Constructor

> **new BurnInstruction**(): `BurnInstruction`

Defined in: [instructions/burnInstruction.ts:16](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/instructions/burnInstruction.ts#L16)

#### Returns

`BurnInstruction`

## Properties

### tag

> **tag**: `number`

Defined in: [instructions/burnInstruction.ts:9](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/instructions/burnInstruction.ts#L9)

Instruction discriminator.

***

### schema

> `static` **schema**: `object`

Defined in: [instructions/burnInstruction.ts:10](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/instructions/burnInstruction.ts#L10)

#### struct

> **struct**: `object`

##### struct.tag

> **tag**: `string` = `"u8"`

## Methods

### getInstruction()

> **getInstruction**(`programId`, `nameServiceId`, `systemProgram`, `domain`, `reverse`, `resellingState`, `state`, `centralState`, `owner`, `target`): `TransactionInstruction`

Defined in: [instructions/burnInstruction.ts:24](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/instructions/burnInstruction.ts#L24)

Builds the transaction instruction with the required burn accounts.

#### Parameters

##### programId

`PublicKey`

##### nameServiceId

`PublicKey`

##### systemProgram

`PublicKey`

##### domain

`PublicKey`

##### reverse

`PublicKey`

##### resellingState

`PublicKey`

##### state

`PublicKey`

##### centralState

`PublicKey`

##### owner

`PublicKey`

##### target

`PublicKey`

#### Returns

`TransactionInstruction`

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [instructions/burnInstruction.ts:20](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/instructions/burnInstruction.ts#L20)

Serializes the registrar instruction payload.

#### Returns

`Uint8Array`
