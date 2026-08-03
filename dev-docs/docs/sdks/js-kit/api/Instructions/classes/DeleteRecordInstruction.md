---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / DeleteRecordInstruction

# Class: DeleteRecordInstruction

Defined in: [instructions/deleteRecordInstruction.ts:5](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/deleteRecordInstruction.ts#L5)

Builder for deleting an SNS V2 record account.

## Constructors

### Constructor

> **new DeleteRecordInstruction**(): `DeleteRecordInstruction`

Defined in: [instructions/deleteRecordInstruction.ts:15](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/deleteRecordInstruction.ts#L15)

#### Returns

`DeleteRecordInstruction`

## Properties

### tag

> **tag**: `number`

Defined in: [instructions/deleteRecordInstruction.ts:7](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/deleteRecordInstruction.ts#L7)

Instruction discriminator.

***

### schema

> `static` **schema**: `object`

Defined in: [instructions/deleteRecordInstruction.ts:9](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/deleteRecordInstruction.ts#L9)

#### struct

> **struct**: `object`

##### struct.tag

> **tag**: `string` = `"u8"`

## Methods

### getInstruction()

> **getInstruction**(`programAddress`, `systemProgram`, `splNameServiceProgram`, `payer`, `record`, `domainAddress`, `domainOwner`, `centralState`): `Instruction`

Defined in: [instructions/deleteRecordInstruction.ts:23](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/deleteRecordInstruction.ts#L23)

#### Parameters

##### programAddress

`Address`

##### systemProgram

`Address`

##### splNameServiceProgram

`Address`

##### payer

`Address`

##### record

`Address`

##### domainAddress

`Address`

##### domainOwner

`Address`

##### centralState

`Address`

#### Returns

`Instruction`

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [instructions/deleteRecordInstruction.ts:19](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/deleteRecordInstruction.ts#L19)

#### Returns

`Uint8Array`
