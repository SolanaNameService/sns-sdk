---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [States](../index.md) / PrimaryDomainState

# Class: PrimaryDomainState

Defined in: [states/primaryDomain.ts:34](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/states/primaryDomain.ts#L34)

Decoded state of an SNS primary-domain account.

## Constructors

### Constructor

> **new PrimaryDomainState**(`obj`): `PrimaryDomainState`

Defined in: [states/primaryDomain.ts:47](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/states/primaryDomain.ts#L47)

#### Parameters

##### obj

[`PrimaryDomainStateParams`](../interfaces/PrimaryDomainStateParams.md)

#### Returns

`PrimaryDomainState`

## Properties

### nameAccount

> **nameAccount**: `Address`

Defined in: [states/primaryDomain.ts:38](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/states/primaryDomain.ts#L38)

Primary domain account address.

***

### tag

> **tag**: `number`

Defined in: [states/primaryDomain.ts:36](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/states/primaryDomain.ts#L36)

Account state tag.

***

### schema

> `static` **schema**: `object`

Defined in: [states/primaryDomain.ts:40](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/states/primaryDomain.ts#L40)

#### struct

> **struct**: `object`

##### struct.nameAccount

> **nameAccount**: `object`

##### struct.nameAccount.array

> **array**: `object`

##### struct.nameAccount.array.len

> **len**: `number` = `32`

##### struct.nameAccount.array.type

> **type**: `string` = `"u8"`

##### struct.tag

> **tag**: `string` = `"u8"`

## Methods

### \_retrieveBatch()

> `static` **\_retrieveBatch**(`rpc`, `primaryAddresses`): `Promise`\<(`PrimaryDomainState` \| `undefined`)[]\>

Defined in: [states/primaryDomain.ts:72](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/states/primaryDomain.ts#L72)

#### Parameters

##### rpc

`Rpc`\<`GetMultipleAccountsApi`\>

##### primaryAddresses

`Address`[]

#### Returns

`Promise`\<(`PrimaryDomainState` \| `undefined`)[]\>

***

### deserialize()

> `static` **deserialize**(`data`): `PrimaryDomainState`

Defined in: [states/primaryDomain.ts:52](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/states/primaryDomain.ts#L52)

#### Parameters

##### data

`Uint8Array`

#### Returns

`PrimaryDomainState`

***

### getAddress()

> `static` **getAddress**(`programAddress`, `walletAddress`): `Promise`\<`Address`\<`string`\>\>

Defined in: [states/primaryDomain.ts:98](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/states/primaryDomain.ts#L98)

#### Parameters

##### programAddress

`Address`

##### walletAddress

`Address`

#### Returns

`Promise`\<`Address`\<`string`\>\>

***

### retrieve()

> `static` **retrieve**(`rpc`, `address`): `Promise`\<`PrimaryDomainState`\>

Defined in: [states/primaryDomain.ts:62](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/states/primaryDomain.ts#L62)

#### Parameters

##### rpc

`Rpc`\<`GetAccountInfoApi`\>

##### address

`Address`

#### Returns

`Promise`\<`PrimaryDomainState`\>

***

### retrieveBatch()

> `static` **retrieveBatch**(`rpc`, `primaryAddresses`): `Promise`\<(`PrimaryDomainState` \| `undefined`)[]\>

Defined in: [states/primaryDomain.ts:83](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/states/primaryDomain.ts#L83)

#### Parameters

##### rpc

`Rpc`\<`GetMultipleAccountsApi`\>

##### primaryAddresses

`Address`[]

#### Returns

`Promise`\<(`PrimaryDomainState` \| `undefined`)[]\>
