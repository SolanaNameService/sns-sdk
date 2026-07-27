---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / AllocateAndPostRecordInstruction

# Class: AllocateAndPostRecordInstruction

Defined in: [instructions/allocateAndPostRecordInstruction.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/allocateAndPostRecordInstruction.ts#L26)

Builder for allocating and writing an SNS V2 record account.

## Constructors

### Constructor

> **new AllocateAndPostRecordInstruction**(`obj`): `AllocateAndPostRecordInstruction`

Defined in: [instructions/allocateAndPostRecordInstruction.ts:42](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/allocateAndPostRecordInstruction.ts#L42)

#### Parameters

##### obj

[`AllocateAndPostRecordInstructionParams`](../interfaces/AllocateAndPostRecordInstructionParams.md)

#### Returns

`AllocateAndPostRecordInstruction`

## Properties

### content

> **content**: `ReadonlyUint8Array`

Defined in: [instructions/allocateAndPostRecordInstruction.ts:32](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/allocateAndPostRecordInstruction.ts#L32)

Serialized record content.

***

### record

> **record**: `string`

Defined in: [instructions/allocateAndPostRecordInstruction.ts:30](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/allocateAndPostRecordInstruction.ts#L30)

Encoded V2 record label.

***

### tag

> **tag**: `number`

Defined in: [instructions/allocateAndPostRecordInstruction.ts:28](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/allocateAndPostRecordInstruction.ts#L28)

Instruction discriminator.

***

### schema

> `static` **schema**: `object`

Defined in: [instructions/allocateAndPostRecordInstruction.ts:34](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/allocateAndPostRecordInstruction.ts#L34)

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

> **getInstruction**(`programAddress`, `systemProgram`, `splNameServiceProgram`, `payer`, `record`, `domainAddress`, `domainOwner`, `centralState`): `Instruction`

Defined in: [instructions/allocateAndPostRecordInstruction.ts:52](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/allocateAndPostRecordInstruction.ts#L52)

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

Defined in: [instructions/allocateAndPostRecordInstruction.ts:48](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/allocateAndPostRecordInstruction.ts#L48)

#### Returns

`Uint8Array`
