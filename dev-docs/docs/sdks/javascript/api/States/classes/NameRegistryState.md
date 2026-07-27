---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [States](../index.md) / NameRegistryState

# Class: NameRegistryState

Defined in: [state.ts:25](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/state.ts#L25)

Deserialized header and payload of an SNS name registry account.

## Constructors

### Constructor

> **new NameRegistryState**(`obj`): `NameRegistryState`

Defined in: [state.ts:45](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/state.ts#L45)

#### Parameters

##### obj

[`NameRegistryStateParams`](../interfaces/NameRegistryStateParams.md)

#### Returns

`NameRegistryState`

## Properties

### class

> **class**: `PublicKey`

Defined in: [state.ts:33](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/state.ts#L33)

Registry class address.

***

### data

> **data**: `Buffer`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [state.ts:35](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/state.ts#L35)

Registry data after the fixed header.

***

### owner

> **owner**: `PublicKey`

Defined in: [state.ts:31](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/state.ts#L31)

Registry owner address.

***

### parentName

> **parentName**: `PublicKey`

Defined in: [state.ts:29](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/state.ts#L29)

Parent registry address.

***

### HEADER\_LEN

> `static` **HEADER\_LEN**: `number` = `96`

Defined in: [state.ts:27](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/state.ts#L27)

Fixed byte length of the registry header.

***

### schema

> `static` **schema**: `object`

Defined in: [state.ts:37](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/state.ts#L37)

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

> `static` **\_retrieveBatch**(`connection`, `nameAccountKeys`): `Promise`\<(`NameRegistryState` \| `undefined`)[]\>

Defined in: [state.ts:80](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/state.ts#L80)

Fetches one RPC-sized batch of name registry accounts.

#### Parameters

##### connection

`Connection`

##### nameAccountKeys

`PublicKey`[]

#### Returns

`Promise`\<(`NameRegistryState` \| `undefined`)[]\>

***

### deserialize()

> `static` **deserialize**(`data`): `NameRegistryState`

Defined in: [state.ts:52](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/state.ts#L52)

Deserializes raw name registry account data.

#### Parameters

##### data

`Buffer`

#### Returns

`NameRegistryState`

***

### retrieve()

> `static` **retrieve**(`connection`, `nameAccountKey`): `Promise`\<\{ `nftOwner`: `PublicKey` \| `null`; `registry`: `NameRegistryState`; \}\>

Defined in: [state.ts:60](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/state.ts#L60)

Fetches a name registry account and its tokenized-domain owner, if any.

#### Parameters

##### connection

`Connection`

##### nameAccountKey

`PublicKey`

#### Returns

`Promise`\<\{ `nftOwner`: `PublicKey` \| `null`; `registry`: `NameRegistryState`; \}\>

***

### retrieveBatch()

> `static` **retrieveBatch**(`connection`, `nameAccountKeys`): `Promise`\<(`NameRegistryState` \| `undefined`)[]\>

Defined in: [state.ts:96](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/state.ts#L96)

Fetches and deserializes name registry accounts in batches of up to 100.

#### Parameters

##### connection

`Connection`

##### nameAccountKeys

`PublicKey`[]

#### Returns

`Promise`\<(`NameRegistryState` \| `undefined`)[]\>
