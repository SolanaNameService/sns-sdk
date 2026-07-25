---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Instructions](../index.md) / CreateWithNftInstruction

# Class: CreateWithNftInstruction

Defined in: [instructions/createWithNftInstruction.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/instructions/createWithNftInstruction.ts#L22)

Serializable registrar instruction for registration with an eligible NFT.

## Constructors

### Constructor

> **new CreateWithNftInstruction**(`obj`): `CreateWithNftInstruction`

Defined in: [instructions/createWithNftInstruction.ts:37](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/instructions/createWithNftInstruction.ts#L37)

#### Parameters

##### obj

[`CreateWithNftInstructionParams`](../interfaces/CreateWithNftInstructionParams.md)

#### Returns

`CreateWithNftInstruction`

## Properties

### name

> **name**: `string`

Defined in: [instructions/createWithNftInstruction.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/instructions/createWithNftInstruction.ts#L26)

TLD-less domain name.

***

### space

> **space**: `number`

Defined in: [instructions/createWithNftInstruction.ts:28](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/instructions/createWithNftInstruction.ts#L28)

Account data size in bytes.

***

### tag

> **tag**: `number`

Defined in: [instructions/createWithNftInstruction.ts:24](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/instructions/createWithNftInstruction.ts#L24)

Instruction discriminator.

***

### schema

> `static` **schema**: `object`

Defined in: [instructions/createWithNftInstruction.ts:29](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/instructions/createWithNftInstruction.ts#L29)

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

> **getInstruction**(`programId`, `namingServiceProgram`, `rootDomain`, `name`, `reverseLookup`, `systemProgram`, `centralState`, `buyer`, `nftSource`, `nftMetadata`, `nftMint`, `masterEdition`, `collection`, `splTokenProgram`, `rentSysvar`, `state`, `mplTokenMetadata`): `TransactionInstruction`

Defined in: [instructions/createWithNftInstruction.ts:47](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/instructions/createWithNftInstruction.ts#L47)

Builds the transaction instruction with the required NFT-registration accounts.

#### Parameters

##### programId

`PublicKey`

##### namingServiceProgram

`PublicKey`

##### rootDomain

`PublicKey`

##### name

`PublicKey`

##### reverseLookup

`PublicKey`

##### systemProgram

`PublicKey`

##### centralState

`PublicKey`

##### buyer

`PublicKey`

##### nftSource

`PublicKey`

##### nftMetadata

`PublicKey`

##### nftMint

`PublicKey`

##### masterEdition

`PublicKey`

##### collection

`PublicKey`

##### splTokenProgram

`PublicKey`

##### rentSysvar

`PublicKey`

##### state

`PublicKey`

##### mplTokenMetadata

`PublicKey`

#### Returns

`TransactionInstruction`

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [instructions/createWithNftInstruction.ts:43](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/instructions/createWithNftInstruction.ts#L43)

Serializes the registrar instruction payload.

#### Returns

`Uint8Array`
