---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / SetRecordRoaVerifierInstruction

# Class: SetRecordRoaVerifierInstruction

Defined in: [instructions/setRecordRoaVerifierInstruction.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/setRecordRoaVerifierInstruction.ts#L26)

Builder for setting an SNS record's Right of Association verifier.

## Constructors

### Constructor

> **new SetRecordRoaVerifierInstruction**(`obj`): `SetRecordRoaVerifierInstruction`

Defined in: [instructions/setRecordRoaVerifierInstruction.ts:39](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/setRecordRoaVerifierInstruction.ts#L39)

#### Parameters

##### obj

[`SetRecordRoaVerifierInstructionParams`](../interfaces/SetRecordRoaVerifierInstructionParams.md)

#### Returns

`SetRecordRoaVerifierInstruction`

## Properties

### roaId

> **roaId**: `ReadonlyUint8Array`

Defined in: [instructions/setRecordRoaVerifierInstruction.ts:30](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/setRecordRoaVerifierInstruction.ts#L30)

Encoded verifier address.

***

### tag

> **tag**: `number`

Defined in: [instructions/setRecordRoaVerifierInstruction.ts:28](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/setRecordRoaVerifierInstruction.ts#L28)

Instruction discriminator.

***

### schema

> `static` **schema**: `object`

Defined in: [instructions/setRecordRoaVerifierInstruction.ts:32](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/setRecordRoaVerifierInstruction.ts#L32)

#### struct

> **struct**: `object`

##### struct.roaId

> **roaId**: `object`

##### struct.roaId.array

> **array**: `object`

##### struct.roaId.array.type

> **type**: `string` = `"u8"`

##### struct.tag

> **tag**: `string` = `"u8"`

## Methods

### getInstruction()

> **getInstruction**(`programAddress`, `systemProgram`, `splNameServiceProgram`, `feePayer`, `record`, `domain`, `domainOwner`, `centralState`): `Instruction`

Defined in: [instructions/setRecordRoaVerifierInstruction.ts:48](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/setRecordRoaVerifierInstruction.ts#L48)

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

Defined in: [instructions/setRecordRoaVerifierInstruction.ts:44](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/setRecordRoaVerifierInstruction.ts#L44)

#### Returns

`Uint8Array`
