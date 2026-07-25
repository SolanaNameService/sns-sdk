---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / ValidateEthereumSignatureInstruction

# Class: ValidateEthereumSignatureInstruction

Defined in: [instructions/validateEthereumSignatureInstruction.ts:28](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/validateEthereumSignatureInstruction.ts#L28)

Builder for validating an Ethereum signature for an SNS record.

## Constructors

### Constructor

> **new ValidateEthereumSignatureInstruction**(`obj`): `ValidateEthereumSignatureInstruction`

Defined in: [instructions/validateEthereumSignatureInstruction.ts:47](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/validateEthereumSignatureInstruction.ts#L47)

#### Parameters

##### obj

[`ValidateEthereumSignatureInstructionParams`](../interfaces/ValidateEthereumSignatureInstructionParams.md)

#### Returns

`ValidateEthereumSignatureInstruction`

## Properties

### expectedPubkey

> **expectedPubkey**: `ReadonlyUint8Array`

Defined in: [instructions/validateEthereumSignatureInstruction.ts:36](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/validateEthereumSignatureInstruction.ts#L36)

Expected Ethereum public key.

***

### signature

> **signature**: `ReadonlyUint8Array`

Defined in: [instructions/validateEthereumSignatureInstruction.ts:34](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/validateEthereumSignatureInstruction.ts#L34)

Ethereum signature.

***

### tag

> **tag**: `number`

Defined in: [instructions/validateEthereumSignatureInstruction.ts:30](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/validateEthereumSignatureInstruction.ts#L30)

Instruction discriminator.

***

### validation

> **validation**: `number`

Defined in: [instructions/validateEthereumSignatureInstruction.ts:32](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/validateEthereumSignatureInstruction.ts#L32)

Validation mode discriminator.

***

### schema

> `static` **schema**: `object`

Defined in: [instructions/validateEthereumSignatureInstruction.ts:38](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/validateEthereumSignatureInstruction.ts#L38)

#### struct

> **struct**: `object`

##### struct.expectedPubkey

> **expectedPubkey**: `object`

##### struct.expectedPubkey.array

> **array**: `object`

##### struct.expectedPubkey.array.type

> **type**: `string` = `"u8"`

##### struct.signature

> **signature**: `object`

##### struct.signature.array

> **array**: `object`

##### struct.signature.array.type

> **type**: `string` = `"u8"`

##### struct.tag

> **tag**: `string` = `"u8"`

##### struct.validation

> **validation**: `string` = `"u8"`

## Methods

### getInstruction()

> **getInstruction**(`programAddress`, `systemProgram`, `splNameServiceProgram`, `feePayer`, `record`, `domain`, `domainOwner`, `centralState`): `Instruction`

Defined in: [instructions/validateEthereumSignatureInstruction.ts:58](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/validateEthereumSignatureInstruction.ts#L58)

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

Defined in: [instructions/validateEthereumSignatureInstruction.ts:54](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/instructions/validateEthereumSignatureInstruction.ts#L54)

#### Returns

`Uint8Array`
