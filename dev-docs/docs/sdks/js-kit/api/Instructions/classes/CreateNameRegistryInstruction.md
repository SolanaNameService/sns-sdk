---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / CreateNameRegistryInstruction

# Class: CreateNameRegistryInstruction

Defined in: [instructions/createNameRegistryInstruction.ts:24](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/createNameRegistryInstruction.ts#L24)

Builder for creating an SNS name-registry account.

## Constructors

### Constructor

> **new CreateNameRegistryInstruction**(`obj`): `CreateNameRegistryInstruction`

Defined in: [instructions/createNameRegistryInstruction.ts:43](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/createNameRegistryInstruction.ts#L43)

#### Parameters

##### obj

[`CreateNameRegistryInstructionParams`](../interfaces/CreateNameRegistryInstructionParams.md)

#### Returns

`CreateNameRegistryInstruction`

## Properties

### lamports

> **lamports**: `bigint`

Defined in: [instructions/createNameRegistryInstruction.ts:30](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/createNameRegistryInstruction.ts#L30)

Account funding amount.

***

### nameHash

> **nameHash**: `Uint8Array`

Defined in: [instructions/createNameRegistryInstruction.ts:28](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/createNameRegistryInstruction.ts#L28)

Hash of the registry name.

***

### space

> **space**: `number`

Defined in: [instructions/createNameRegistryInstruction.ts:32](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/createNameRegistryInstruction.ts#L32)

Account data size in bytes.

***

### tag

> **tag**: `number`

Defined in: [instructions/createNameRegistryInstruction.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/createNameRegistryInstruction.ts#L26)

Instruction discriminator.

***

### schema

> `static` **schema**: `object`

Defined in: [instructions/createNameRegistryInstruction.ts:34](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/createNameRegistryInstruction.ts#L34)

#### struct

> **struct**: `object`

##### struct.lamports

> **lamports**: `string` = `"u64"`

##### struct.nameHash

> **nameHash**: `object`

##### struct.nameHash.array

> **array**: `object`

##### struct.nameHash.array.type

> **type**: `string` = `"u8"`

##### struct.space

> **space**: `string` = `"u32"`

##### struct.tag

> **tag**: `string` = `"u8"`

## Methods

### getInstruction()

> **getInstruction**(`programAddress`, `systemProgram`, `domainAddress`, `owner`, `payer`, `classAddress?`, `parentAddress?`, `parentOwner?`): `Instruction`

Defined in: [instructions/createNameRegistryInstruction.ts:54](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/createNameRegistryInstruction.ts#L54)

#### Parameters

##### programAddress

`Address`

##### systemProgram

`Address`

##### domainAddress

`Address`

##### owner

`Address`

##### payer

`Address`

##### classAddress?

`Address`

##### parentAddress?

`Address`

##### parentOwner?

`Address`

#### Returns

`Instruction`

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [instructions/createNameRegistryInstruction.ts:50](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/createNameRegistryInstruction.ts#L50)

#### Returns

`Uint8Array`
