---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [States](../index.md) / RegistryState

# Class: RegistryState

Defined in: [states/registry.ts:35](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/states/registry.ts#L35)

Decoded state of an SNS name-registry account.

## Constructors

### Constructor

> **new RegistryState**(`obj`): `RegistryState`

Defined in: [states/registry.ts:59](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/states/registry.ts#L59)

#### Parameters

##### obj

[`RegistryStateParams`](../interfaces/RegistryStateParams.md)

#### Returns

`RegistryState`

## Properties

### class

> **class**: `Address`

Defined in: [states/registry.ts:41](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/states/registry.ts#L41)

Registry class address.

***

### data

> **data**: `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [states/registry.ts:43](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/states/registry.ts#L43)

Registry data after the fixed header.

***

### owner

> **owner**: `Address`

Defined in: [states/registry.ts:39](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/states/registry.ts#L39)

Registry owner address.

***

### parentName

> **parentName**: `Address`

Defined in: [states/registry.ts:37](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/states/registry.ts#L37)

Parent registry address.

***

### HEADER\_LEN

> `static` **HEADER\_LEN**: `number` = `96`

Defined in: [states/registry.ts:57](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/states/registry.ts#L57)

***

### schema

> `static` **schema**: `object`

Defined in: [states/registry.ts:45](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/states/registry.ts#L45)

#### struct

> **struct**: `object`

##### struct.class

> **class**: `object`

##### struct.class.array

> **array**: `object`

##### struct.class.array.len

> **len**: `number` = `32`

##### struct.class.array.type

> **type**: `string` = `"u8"`

##### struct.owner

> **owner**: `object`

##### struct.owner.array

> **array**: `object`

##### struct.owner.array.len

> **len**: `number` = `32`

##### struct.owner.array.type

> **type**: `string` = `"u8"`

##### struct.parentName

> **parentName**: `object`

##### struct.parentName.array

> **array**: `object`

##### struct.parentName.array.len

> **len**: `number` = `32`

##### struct.parentName.array.type

> **type**: `string` = `"u8"`

## Methods

### \_retrieveBatch()

> `static` **\_retrieveBatch**(`rpc`, `domainAddresses`): `Promise`\<(`RegistryState` \| `undefined`)[]\>

Defined in: [states/registry.ts:90](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/states/registry.ts#L90)

#### Parameters

##### rpc

`Rpc`\<`GetMultipleAccountsApi`\>

##### domainAddresses

`Address`[]

#### Returns

`Promise`\<(`RegistryState` \| `undefined`)[]\>

***

### deserialize()

> `static` **deserialize**(`data`): `RegistryState`

Defined in: [states/registry.ts:65](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/states/registry.ts#L65)

#### Parameters

##### data

`Uint8Array`

#### Returns

`RegistryState`

***

### retrieve()

> `static` **retrieve**(`rpc`, `address`): `Promise`\<`RegistryState`\>

Defined in: [states/registry.ts:78](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/states/registry.ts#L78)

#### Parameters

##### rpc

`Rpc`\<`GetAccountInfoApi`\>

##### address

`Address`

#### Returns

`Promise`\<`RegistryState`\>

***

### retrieveBatch()

> `static` **retrieveBatch**(`rpc`, `domainAddresses`): `Promise`\<(`RegistryState` \| `undefined`)[]\>

Defined in: [states/registry.ts:101](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/states/registry.ts#L101)

#### Parameters

##### rpc

`Rpc`\<`GetMultipleAccountsApi`\>

##### domainAddresses

`Address`[]

#### Returns

`Promise`\<(`RegistryState` \| `undefined`)[]\>
