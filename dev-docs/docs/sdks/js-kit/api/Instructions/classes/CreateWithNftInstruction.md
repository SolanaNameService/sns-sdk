---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / CreateWithNftInstruction

# Class: CreateWithNftInstruction

Defined in: [instructions/createWithNftInstruction.ts:20](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/createWithNftInstruction.ts#L20)

Builder for registering an SNS domain backed by an NFT.

## Constructors

### Constructor

> **new CreateWithNftInstruction**(`obj`): `CreateWithNftInstruction`

Defined in: [instructions/createWithNftInstruction.ts:36](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/createWithNftInstruction.ts#L36)

#### Parameters

##### obj

[`CreateWithNftInstructionParams`](../interfaces/CreateWithNftInstructionParams.md)

#### Returns

`CreateWithNftInstruction`

## Properties

### name

> **name**: `string`

Defined in: [instructions/createWithNftInstruction.ts:24](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/createWithNftInstruction.ts#L24)

TLD-less domain name.

***

### space

> **space**: `number`

Defined in: [instructions/createWithNftInstruction.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/createWithNftInstruction.ts#L26)

Account data size in bytes.

***

### tag

> **tag**: `number`

Defined in: [instructions/createWithNftInstruction.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/createWithNftInstruction.ts#L22)

Instruction discriminator.

***

### schema

> `static` **schema**: `object`

Defined in: [instructions/createWithNftInstruction.ts:28](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/createWithNftInstruction.ts#L28)

#### struct

> **struct**: `object`

##### struct.name

> **name**: `string` = `"string"`

##### struct.space

> **space**: `string` = `"u32"`

##### struct.tag

> **tag**: `string` = `"u8"`

## Methods

### getInstruction()

> **getInstruction**(`programAddress`, `namingServiceProgram`, `rootDomain`, `name`, `reverseLookup`, `systemProgram`, `centralState`, `buyer`, `nftSource`, `nftMetadata`, `nftMint`, `masterEdition`, `collection`, `splTokenProgram`, `rentSysvar`, `state`, `mplTokenMetadata`): `Instruction`

Defined in: [instructions/createWithNftInstruction.ts:46](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/createWithNftInstruction.ts#L46)

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

##### nftSource

`Address`

##### nftMetadata

`Address`

##### nftMint

`Address`

##### masterEdition

`Address`

##### collection

`Address`

##### splTokenProgram

`Address`

##### rentSysvar

`Address`

##### state

`Address`

##### mplTokenMetadata

`Address`

#### Returns

`Instruction`

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [instructions/createWithNftInstruction.ts:42](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/createWithNftInstruction.ts#L42)

#### Returns

`Uint8Array`
