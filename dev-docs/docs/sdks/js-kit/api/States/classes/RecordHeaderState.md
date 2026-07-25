---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [States](../index.md) / RecordHeaderState

# Class: RecordHeaderState

Defined in: [states/record.ts:62](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/states/record.ts#L62)

Decoded header of an SNS V2 record account.

## Constructors

### Constructor

> **new RecordHeaderState**(`obj`): `RecordHeaderState`

Defined in: [states/record.ts:84](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/states/record.ts#L84)

#### Parameters

##### obj

[`RecordHeaderStateParams`](../interfaces/RecordHeaderStateParams.md)

#### Returns

`RecordHeaderState`

## Properties

### contentLength

> **contentLength**: `number`

Defined in: [states/record.ts:68](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/states/record.ts#L68)

Record content length in bytes.

***

### rightOfAssociationValidation

> **rightOfAssociationValidation**: `number`

Defined in: [states/record.ts:66](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/states/record.ts#L66)

Right of Association validation mode.

***

### stalenessValidation

> **stalenessValidation**: `number`

Defined in: [states/record.ts:64](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/states/record.ts#L64)

Staleness validation mode.

***

### LEN

> `static` **LEN**: `number` = `8`

Defined in: [states/record.ts:82](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/states/record.ts#L82)

***

### schema

> `static` **schema**: `Schema`

Defined in: [states/record.ts:70](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/states/record.ts#L70)

## Methods

### deserialize()

> `static` **deserialize**(`data`): `RecordHeaderState`

Defined in: [states/record.ts:90](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/states/record.ts#L90)

#### Parameters

##### data

`Uint8Array`

#### Returns

`RecordHeaderState`

***

### retrieve()

> `static` **retrieve**(`rpc`, `address`): `Promise`\<`RecordHeaderState`\>

Defined in: [states/record.ts:94](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/states/record.ts#L94)

#### Parameters

##### rpc

`Rpc`\<`GetAccountInfoApi`\>

##### address

`Address`

#### Returns

`Promise`\<`RecordHeaderState`\>
