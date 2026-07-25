---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / ReallocInstruction

# Class: ReallocInstruction

Defined in: [instructions/reallocInstruction.ts:18](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/reallocInstruction.ts#L18)

Builder for reallocating an SNS name-registry account.

## Constructors

### Constructor

> **new ReallocInstruction**(`obj`): `ReallocInstruction`

Defined in: [instructions/reallocInstruction.ts:31](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/reallocInstruction.ts#L31)

#### Parameters

##### obj

[`ReallocInstructionParams`](../interfaces/ReallocInstructionParams.md)

#### Returns

`ReallocInstruction`

## Properties

### space

> **space**: `number`

Defined in: [instructions/reallocInstruction.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/reallocInstruction.ts#L22)

New account data size in bytes.

***

### tag

> **tag**: `number`

Defined in: [instructions/reallocInstruction.ts:20](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/reallocInstruction.ts#L20)

Instruction discriminator.

***

### schema

> `static` **schema**: `object`

Defined in: [instructions/reallocInstruction.ts:24](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/reallocInstruction.ts#L24)

#### struct

> **struct**: `object`

##### struct.space

> **space**: `string` = `"u32"`

##### struct.tag

> **tag**: `string` = `"u8"`

## Methods

### getInstruction()

> **getInstruction**(`programAddress`, `systemProgramId`, `payerKey`, `nameAccountKey`, `nameOwnerKey`): `Instruction`

Defined in: [instructions/reallocInstruction.ts:40](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/reallocInstruction.ts#L40)

#### Parameters

##### programAddress

`Address`

##### systemProgramId

`Address`

##### payerKey

`Address`

##### nameAccountKey

`Address`

##### nameOwnerKey

`Address`

#### Returns

`Instruction`

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [instructions/reallocInstruction.ts:36](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/reallocInstruction.ts#L36)

#### Returns

`Uint8Array`
