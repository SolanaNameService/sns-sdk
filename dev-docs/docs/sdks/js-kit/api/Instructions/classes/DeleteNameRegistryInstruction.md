---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / DeleteNameRegistryInstruction

# Class: DeleteNameRegistryInstruction

Defined in: [instructions/deleteNameRegistryInstruction.ts:5](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/deleteNameRegistryInstruction.ts#L5)

Builder for deleting an SNS name-registry account.

## Constructors

### Constructor

> **new DeleteNameRegistryInstruction**(): `DeleteNameRegistryInstruction`

Defined in: [instructions/deleteNameRegistryInstruction.ts:15](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/deleteNameRegistryInstruction.ts#L15)

#### Returns

`DeleteNameRegistryInstruction`

## Properties

### tag

> **tag**: `number`

Defined in: [instructions/deleteNameRegistryInstruction.ts:7](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/deleteNameRegistryInstruction.ts#L7)

Instruction discriminator.

***

### schema

> `static` **schema**: `object`

Defined in: [instructions/deleteNameRegistryInstruction.ts:9](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/deleteNameRegistryInstruction.ts#L9)

#### struct

> **struct**: `object`

##### struct.tag

> **tag**: `string` = `"u8"`

## Methods

### getInstruction()

> **getInstruction**(`programAddress`, `domainAddress`, `refundTarget`, `owner`): `Instruction`

Defined in: [instructions/deleteNameRegistryInstruction.ts:23](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/deleteNameRegistryInstruction.ts#L23)

#### Parameters

##### programAddress

`Address`

##### domainAddress

`Address`

##### refundTarget

`Address`

##### owner

`Address`

#### Returns

`Instruction`

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [instructions/deleteNameRegistryInstruction.ts:19](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/deleteNameRegistryInstruction.ts#L19)

#### Returns

`Uint8Array`
