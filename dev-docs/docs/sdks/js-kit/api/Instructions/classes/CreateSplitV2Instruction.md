---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / CreateSplitV2Instruction

# Class: CreateSplitV2Instruction

Defined in: [instructions/createSplitV2Instruction.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/createSplitV2Instruction.ts#L22)

Builder for creating a split SNS V2 domain account.

## Constructors

### Constructor

> **new CreateSplitV2Instruction**(`obj`): `CreateSplitV2Instruction`

Defined in: [instructions/createSplitV2Instruction.ts:41](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/createSplitV2Instruction.ts#L41)

#### Parameters

##### obj

[`CreateSplitV2InstructionParams`](../interfaces/CreateSplitV2InstructionParams.md)

#### Returns

`CreateSplitV2Instruction`

## Properties

### name

> **name**: `string`

Defined in: [instructions/createSplitV2Instruction.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/createSplitV2Instruction.ts#L26)

TLD-less domain name.

***

### referrerIdxOpt

> **referrerIdxOpt**: `number` \| `null`

Defined in: [instructions/createSplitV2Instruction.ts:30](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/createSplitV2Instruction.ts#L30)

Approved referrer index, if any.

***

### space

> **space**: `number`

Defined in: [instructions/createSplitV2Instruction.ts:28](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/createSplitV2Instruction.ts#L28)

Account data size in bytes.

***

### tag

> **tag**: `number`

Defined in: [instructions/createSplitV2Instruction.ts:24](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/createSplitV2Instruction.ts#L24)

Instruction discriminator.

***

### schema

> `static` **schema**: `object`

Defined in: [instructions/createSplitV2Instruction.ts:32](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/createSplitV2Instruction.ts#L32)

#### struct

> **struct**: `object`

##### struct.name

> **name**: `string` = `"string"`

##### struct.referrerIdxOpt

> **referrerIdxOpt**: `object`

##### struct.referrerIdxOpt.option

> **option**: `string` = `"u16"`

##### struct.space

> **space**: `string` = `"u32"`

##### struct.tag

> **tag**: `string` = `"u8"`

## Methods

### getInstruction()

> **getInstruction**(`programAddress`, `namingServiceProgram`, `rootDomain`, `name`, `reverseLookup`, `systemProgram`, `centralState`, `buyer`, `domainOwner`, `feePayer`, `buyerTokenSource`, `pythFeedAccount`, `vault`, `splTokenProgram`, `rentSysvar`, `state`, `referrerAccountOpt?`): `Instruction`

Defined in: [instructions/createSplitV2Instruction.ts:52](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/createSplitV2Instruction.ts#L52)

#### Parameters

##### programAddress

`Address`

##### namingServiceProgram

`Address`

##### rootDomain

`Address`

##### name

`Address`

##### reverseLookup

`Address`

##### systemProgram

`Address`

##### centralState

`Address`

##### buyer

`Address`

##### domainOwner

`Address`

##### feePayer

`Address`

##### buyerTokenSource

`Address`

##### pythFeedAccount

`Address`

##### vault

`Address`

##### splTokenProgram

`Address`

##### rentSysvar

`Address`

##### state

`Address`

##### referrerAccountOpt?

`Address`

#### Returns

`Instruction`

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [instructions/createSplitV2Instruction.ts:48](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/createSplitV2Instruction.ts#L48)

#### Returns

`Uint8Array`
