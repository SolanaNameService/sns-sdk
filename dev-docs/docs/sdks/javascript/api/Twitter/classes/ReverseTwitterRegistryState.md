---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Twitter](../index.md) / ReverseTwitterRegistryState

# Class: ReverseTwitterRegistryState

Defined in: [twitter/ReverseTwitterRegistryState.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/twitter/ReverseTwitterRegistryState.ts#L22)

Deserialized reverse registry linking a verified key to a Twitter handle.

## Constructors

### Constructor

> **new ReverseTwitterRegistryState**(`obj`): `ReverseTwitterRegistryState`

Defined in: [twitter/ReverseTwitterRegistryState.ts:35](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/twitter/ReverseTwitterRegistryState.ts#L35)

#### Parameters

##### obj

[`ReverseTwitterRegistryStateParams`](../interfaces/ReverseTwitterRegistryStateParams.md)

#### Returns

`ReverseTwitterRegistryState`

## Properties

### twitterHandle

> **twitterHandle**: `string`

Defined in: [twitter/ReverseTwitterRegistryState.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/twitter/ReverseTwitterRegistryState.ts#L26)

Verified Twitter handle.

***

### twitterRegistryKey

> **twitterRegistryKey**: `Uint8Array`

Defined in: [twitter/ReverseTwitterRegistryState.ts:24](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/twitter/ReverseTwitterRegistryState.ts#L24)

Encoded verified Twitter registry address.

***

### schema

> `static` **schema**: `object`

Defined in: [twitter/ReverseTwitterRegistryState.ts:28](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/twitter/ReverseTwitterRegistryState.ts#L28)

#### struct

> **struct**: `object`

##### struct.twitterHandle

> **twitterHandle**: `string` = `"string"`

##### struct.twitterRegistryKey

> **twitterRegistryKey**: `object`

##### struct.twitterRegistryKey.array

> **array**: `object`

##### struct.twitterRegistryKey.array.len

> **len**: `number` = `32`

##### struct.twitterRegistryKey.array.type

> **type**: `string` = `"u8"`

## Methods

### retrieve()

> `static` **retrieve**(`connection`, `reverseTwitterAccountKey`): `Promise`\<`ReverseTwitterRegistryState`\>

Defined in: [twitter/ReverseTwitterRegistryState.ts:41](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/twitter/ReverseTwitterRegistryState.ts#L41)

Fetches and deserializes a reverse Twitter registry account.

#### Parameters

##### connection

`Connection`

##### reverseTwitterAccountKey

`PublicKey`

#### Returns

`Promise`\<`ReverseTwitterRegistryState`\>
