---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Address](../index.md) / PrimaryDomain

# Class: PrimaryDomain

Defined in: [primary-domain.ts:37](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/primary-domain.ts#L37)

Deserialized primary-domain account and its address derivation helpers.

## Constructors

### Constructor

> **new PrimaryDomain**(`obj`): `PrimaryDomain`

Defined in: [primary-domain.ts:49](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/primary-domain.ts#L49)

#### Parameters

##### obj

[`PrimaryDomainParams`](../interfaces/PrimaryDomainParams.md)

#### Returns

`PrimaryDomain`

## Properties

### nameAccount

> **nameAccount**: `PublicKey`

Defined in: [primary-domain.ts:41](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/primary-domain.ts#L41)

Primary domain account address.

***

### tag

> **tag**: `number`

Defined in: [primary-domain.ts:39](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/primary-domain.ts#L39)

Account state tag.

***

### schema

> `static` **schema**: `object`

Defined in: [primary-domain.ts:42](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/primary-domain.ts#L42)

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

### deserialize()

> `static` **deserialize**(`data`): `PrimaryDomain`

Defined in: [primary-domain.ts:60](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/primary-domain.ts#L60)

Deserializes raw primary-domain account data.

#### Parameters

##### data

`Buffer`

The raw primary-domain account data

#### Returns

`PrimaryDomain`

The deserialized primary-domain account

***

### getKey()

> `static` **getKey**(`programId`, `owner`): `Promise`\<\[`PublicKey`, `number`\]\>

Defined in: [primary-domain.ts:88](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/primary-domain.ts#L88)

Derives the primary-domain account address for an owner.

#### Parameters

##### programId

`PublicKey`

The primary-domain program ID

##### owner

`PublicKey`

The public key of the wallet owner

#### Returns

`Promise`\<\[`PublicKey`, `number`\]\>

The derived primary-domain account address and bump seed

***

### getKeySync()

> `static` **getKeySync**(`programId`, `owner`): \[`PublicKey`, `number`\]

Defined in: [primary-domain.ts:102](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/primary-domain.ts#L102)

Synchronously derives the primary-domain account address for an owner.

#### Parameters

##### programId

`PublicKey`

The primary-domain program ID

##### owner

`PublicKey`

The public key of the wallet owner

#### Returns

\[`PublicKey`, `number`\]

The derived primary-domain account address and bump seed

***

### retrieve()

> `static` **retrieve**(`connection`, `key`): `Promise`\<`PrimaryDomain`\>

Defined in: [primary-domain.ts:71](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/primary-domain.ts#L71)

Fetches and deserializes a primary-domain account.

#### Parameters

##### connection

`Connection`

Solana RPC connection

##### key

`PublicKey`

The primary-domain account address

#### Returns

`Promise`\<`PrimaryDomain`\>

The deserialized primary-domain account
