---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / CreateReverseInstruction

# Class: CreateReverseInstruction

Defined in: [instructions/createReverseInstruction.ts:18](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/createReverseInstruction.ts#L18)

Builder for creating an SNS reverse-lookup account.

## Constructors

### Constructor

> **new CreateReverseInstruction**(`obj`): `CreateReverseInstruction`

Defined in: [instructions/createReverseInstruction.ts:30](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/createReverseInstruction.ts#L30)

#### Parameters

##### obj

[`CreateReverseInstructionParams`](../interfaces/CreateReverseInstructionParams.md)

#### Returns

`CreateReverseInstruction`

## Properties

### domain

> **domain**: `string`

Defined in: [instructions/createReverseInstruction.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/createReverseInstruction.ts#L22)

Raw reverse lookup payload.

***

### tag

> **tag**: `number`

Defined in: [instructions/createReverseInstruction.ts:20](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/createReverseInstruction.ts#L20)

Instruction discriminator.

***

### schema

> `static` **schema**: `object`

Defined in: [instructions/createReverseInstruction.ts:23](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/createReverseInstruction.ts#L23)

#### struct

> **struct**: `object`

##### struct.domain

> **domain**: `string` = `"string"`

##### struct.tag

> **tag**: `string` = `"u8"`

## Methods

### getInstruction()

> **getInstruction**(`programAddress`, `namingServiceProgram`, `rootDomain`, `reverseLookup`, `systemProgram`, `centralState`, `payer`, `rentSysvar`, `parentAddress?`, `parentOwner?`): `Instruction`

Defined in: [instructions/createReverseInstruction.ts:39](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/createReverseInstruction.ts#L39)

#### Parameters

##### programAddress

`Address`

##### namingServiceProgram

`Address`

##### rootDomain

`Address`

##### reverseLookup

`Address`

##### systemProgram

`Address`

##### centralState

`Address`

##### payer

`Address`

##### rentSysvar

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

Defined in: [instructions/createReverseInstruction.ts:35](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/createReverseInstruction.ts#L35)

#### Returns

`Uint8Array`
