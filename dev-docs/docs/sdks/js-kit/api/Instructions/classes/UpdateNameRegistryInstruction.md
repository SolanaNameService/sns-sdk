---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / UpdateNameRegistryInstruction

# Class: UpdateNameRegistryInstruction

Defined in: [instructions/updateNameRegistryInstruction.ts:20](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/updateNameRegistryInstruction.ts#L20)

Builder for updating the data of an SNS name-registry account.

## Constructors

### Constructor

> **new UpdateNameRegistryInstruction**(`obj`): `UpdateNameRegistryInstruction`

Defined in: [instructions/updateNameRegistryInstruction.ts:36](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/updateNameRegistryInstruction.ts#L36)

#### Parameters

##### obj

[`UpdateNameRegistryInstructionParams`](../interfaces/UpdateNameRegistryInstructionParams.md)

#### Returns

`UpdateNameRegistryInstruction`

## Properties

### inputData

> **inputData**: `Uint8Array`

Defined in: [instructions/updateNameRegistryInstruction.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/updateNameRegistryInstruction.ts#L26)

Bytes to write.

***

### offset

> **offset**: `number`

Defined in: [instructions/updateNameRegistryInstruction.ts:24](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/updateNameRegistryInstruction.ts#L24)

Byte offset where the update begins.

***

### tag

> **tag**: `number`

Defined in: [instructions/updateNameRegistryInstruction.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/updateNameRegistryInstruction.ts#L22)

Instruction discriminator.

***

### schema

> `static` **schema**: `object`

Defined in: [instructions/updateNameRegistryInstruction.ts:28](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/updateNameRegistryInstruction.ts#L28)

#### struct

> **struct**: `object`

##### struct.inputData

> **inputData**: `object`

##### struct.inputData.array

> **array**: `object`

##### struct.inputData.array.type

> **type**: `string` = `"u8"`

##### struct.offset

> **offset**: `string` = `"u32"`

##### struct.tag

> **tag**: `string` = `"u8"`

## Methods

### getInstruction()

> **getInstruction**(`programAddress`, `domainAddress`, `signer`): `Instruction`

Defined in: [instructions/updateNameRegistryInstruction.ts:46](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/updateNameRegistryInstruction.ts#L46)

#### Parameters

##### programAddress

`Address`

##### domainAddress

`Address`

##### signer

`Address`

#### Returns

`Instruction`

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [instructions/updateNameRegistryInstruction.ts:42](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/updateNameRegistryInstruction.ts#L42)

#### Returns

`Uint8Array`
