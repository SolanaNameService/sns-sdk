---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [States](../index.md) / RecordState

# Class: RecordState

Defined in: [states/record.ts:111](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/record.ts#L111)

Decoded SNS V2 record account, including its validation data and content.

## Constructors

### Constructor

> **new RecordState**(`header`, `data`): `RecordState`

Defined in: [states/record.ts:117](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/record.ts#L117)

#### Parameters

##### header

[`RecordHeaderState`](RecordHeaderState.md)

##### data

`Uint8Array`

#### Returns

`RecordState`

## Properties

### data

> **data**: `Uint8Array`

Defined in: [states/record.ts:115](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/record.ts#L115)

Validation identifiers and record content.

***

### header

> **header**: [`RecordHeaderState`](RecordHeaderState.md)

Defined in: [states/record.ts:113](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/record.ts#L113)

Decoded record header.

## Methods

### getContent()

> **getContent**(): `Uint8Array`

Defined in: [states/record.ts:154](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/record.ts#L154)

#### Returns

`Uint8Array`

***

### getRoAId()

> **getRoAId**(): `Uint8Array`

Defined in: [states/record.ts:174](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/record.ts#L174)

#### Returns

`Uint8Array`

***

### getStalenessId()

> **getStalenessId**(): `Uint8Array`

Defined in: [states/record.ts:168](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/record.ts#L168)

#### Returns

`Uint8Array`

***

### deserialize()

> `static` **deserialize**(`data`): `RecordState`

Defined in: [states/record.ts:122](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/record.ts#L122)

#### Parameters

##### data

`Uint8Array`

#### Returns

`RecordState`

***

### retrieve()

> `static` **retrieve**(`rpc`, `address`): `Promise`\<`RecordState`\>

Defined in: [states/record.ts:131](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/record.ts#L131)

#### Parameters

##### rpc

`Rpc`\<`GetAccountInfoApi`\>

##### address

`Address`

#### Returns

`Promise`\<`RecordState`\>

***

### retrieveBatch()

> `static` **retrieveBatch**(`rpc`, `addresses`): `Promise`\<(`RecordState` \| `undefined`)[]\>

Defined in: [states/record.ts:143](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/record.ts#L143)

#### Parameters

##### rpc

`Rpc`\<`GetMultipleAccountsApi`\>

##### addresses

`Address`[]

#### Returns

`Promise`\<(`RecordState` \| `undefined`)[]\>
