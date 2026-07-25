---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / UpdateRecordInstruction

# Class: UpdateRecordInstruction

Defined in: [instructions/updateRecordInstruction.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/updateRecordInstruction.ts#L26)

Builder for updating content in an SNS V2 record account.

## Constructors

### Constructor

> **new UpdateRecordInstruction**(`obj`): `UpdateRecordInstruction`

Defined in: [instructions/updateRecordInstruction.ts:42](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/updateRecordInstruction.ts#L42)

#### Parameters

##### obj

[`UpdateRecordInstructionParams`](../interfaces/UpdateRecordInstructionParams.md)

#### Returns

`UpdateRecordInstruction`

## Properties

### content

> **content**: `ReadonlyUint8Array`

Defined in: [instructions/updateRecordInstruction.ts:32](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/updateRecordInstruction.ts#L32)

Serialized record content.

***

### record

> **record**: `string`

Defined in: [instructions/updateRecordInstruction.ts:30](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/updateRecordInstruction.ts#L30)

Encoded V2 record label.

***

### tag

> **tag**: `number`

Defined in: [instructions/updateRecordInstruction.ts:28](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/updateRecordInstruction.ts#L28)

Instruction discriminator.

***

### schema

> `static` **schema**: `object`

Defined in: [instructions/updateRecordInstruction.ts:34](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/updateRecordInstruction.ts#L34)

#### struct

> **struct**: `object`

##### struct.content

> **content**: `object`

##### struct.content.array

> **array**: `object`

##### struct.content.array.type

> **type**: `string` = `"u8"`

##### struct.record

> **record**: `string` = `"string"`

##### struct.tag

> **tag**: `string` = `"u8"`

## Methods

### getInstruction()

> **getInstruction**(`programAddress`, `systemProgram`, `splNameServiceProgram`, `feePayer`, `record`, `domain`, `domainOwner`, `centralState`): `Instruction`

Defined in: [instructions/updateRecordInstruction.ts:52](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/updateRecordInstruction.ts#L52)

#### Parameters

##### programAddress

`Address`

##### systemProgram

`Address`

##### splNameServiceProgram

`Address`

##### feePayer

`Address`

##### record

`Address`

##### domain

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

Defined in: [instructions/updateRecordInstruction.ts:48](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/updateRecordInstruction.ts#L48)

#### Returns

`Uint8Array`
