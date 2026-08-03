---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / ValidateSolanaSignatureInstruction

# Class: ValidateSolanaSignatureInstruction

Defined in: [instructions/validateSolanaSignatureInstruction.ts:18](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/validateSolanaSignatureInstruction.ts#L18)

Builder for validating a Solana signature for an SNS record.

## Constructors

### Constructor

> **new ValidateSolanaSignatureInstruction**(`obj`): `ValidateSolanaSignatureInstruction`

Defined in: [instructions/validateSolanaSignatureInstruction.ts:30](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/validateSolanaSignatureInstruction.ts#L30)

#### Parameters

##### obj

[`ValidateSolanaSignatureInstructionParams`](../interfaces/ValidateSolanaSignatureInstructionParams.md)

#### Returns

`ValidateSolanaSignatureInstruction`

## Properties

### staleness

> **staleness**: `boolean`

Defined in: [instructions/validateSolanaSignatureInstruction.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/validateSolanaSignatureInstruction.ts#L22)

Whether to validate staleness.

***

### tag

> **tag**: `number`

Defined in: [instructions/validateSolanaSignatureInstruction.ts:20](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/validateSolanaSignatureInstruction.ts#L20)

Instruction discriminator.

***

### schema

> `static` **schema**: `object`

Defined in: [instructions/validateSolanaSignatureInstruction.ts:23](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/validateSolanaSignatureInstruction.ts#L23)

#### struct

> **struct**: `object`

##### struct.staleness

> **staleness**: `string` = `"bool"`

##### struct.tag

> **tag**: `string` = `"u8"`

## Methods

### getInstruction()

> **getInstruction**(`programAddress`, `systemProgram`, `splNameServiceProgram`, `feePayer`, `record`, `domain`, `domainOwner`, `centralState`, `verifier`): `Instruction`

Defined in: [instructions/validateSolanaSignatureInstruction.ts:39](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/validateSolanaSignatureInstruction.ts#L39)

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

##### verifier

`Address`

#### Returns

`Instruction`

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [instructions/validateSolanaSignatureInstruction.ts:35](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/validateSolanaSignatureInstruction.ts#L35)

#### Returns

`Uint8Array`
