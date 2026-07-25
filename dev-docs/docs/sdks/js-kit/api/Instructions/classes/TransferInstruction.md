---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / TransferInstruction

# Class: TransferInstruction

Defined in: [instructions/transferInstruction.ts:27](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/transferInstruction.ts#L27)

Builder for the SNS name-registry transfer instruction.

## Constructors

### Constructor

> **new TransferInstruction**(`obj`): `TransferInstruction`

Defined in: [instructions/transferInstruction.ts:40](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/transferInstruction.ts#L40)

#### Parameters

##### obj

[`TransferInstructionParams`](../interfaces/TransferInstructionParams.md)

#### Returns

`TransferInstruction`

## Properties

### encodedNewOwnerAddress

> **encodedNewOwnerAddress**: `ReadonlyUint8Array`

Defined in: [instructions/transferInstruction.ts:31](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/transferInstruction.ts#L31)

Encoded new owner address.

***

### tag

> **tag**: `number`

Defined in: [instructions/transferInstruction.ts:29](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/transferInstruction.ts#L29)

Instruction discriminator.

***

### schema

> `static` **schema**: `object`

Defined in: [instructions/transferInstruction.ts:33](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/transferInstruction.ts#L33)

#### struct

> **struct**: `object`

##### struct.encodedNewOwnerAddress

> **encodedNewOwnerAddress**: `object`

##### struct.encodedNewOwnerAddress.array

> **array**: `object`

##### struct.encodedNewOwnerAddress.array.len

> **len**: `number` = `32`

##### struct.encodedNewOwnerAddress.array.type

> **type**: `string` = `"u8"`

##### struct.tag

> **tag**: `string` = `"u8"`

## Methods

### getInstruction()

> **getInstruction**(`programAddress`, `domainAddress`, `currentOwner`, `classAddress?`, `parentAddress?`, `parentOwner?`): `Instruction`

Defined in: [instructions/transferInstruction.ts:49](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/transferInstruction.ts#L49)

#### Parameters

##### programAddress

`Address`

##### domainAddress

`Address`

##### currentOwner

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

Defined in: [instructions/transferInstruction.ts:45](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/transferInstruction.ts#L45)

#### Returns

`Uint8Array`
