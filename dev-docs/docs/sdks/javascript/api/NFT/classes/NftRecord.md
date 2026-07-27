---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [NFT](../index.md) / NftRecord

# Class: NftRecord

Defined in: [nft/state.ts:40](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/nft/state.ts#L40)

Deserialized name-tokenizer record linking a name account to its NFT mint.

## Constructors

### Constructor

> **new NftRecord**(`obj`): `NftRecord`

Defined in: [nft/state.ts:64](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/nft/state.ts#L64)

#### Parameters

##### obj

[`NftRecordParams`](../interfaces/NftRecordParams.md)

#### Returns

`NftRecord`

## Properties

### nameAccount

> **nameAccount**: `PublicKey`

Defined in: [nft/state.ts:46](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/nft/state.ts#L46)

SNS domain account address.

***

### nftMint

> **nftMint**: `PublicKey`

Defined in: [nft/state.ts:50](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/nft/state.ts#L50)

NFT mint address.

***

### nonce

> **nonce**: `number`

Defined in: [nft/state.ts:44](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/nft/state.ts#L44)

NFT record nonce.

***

### owner

> **owner**: `PublicKey`

Defined in: [nft/state.ts:48](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/nft/state.ts#L48)

NFT owner address.

***

### tag

> **tag**: [`Tag`](../enumerations/Tag.md)

Defined in: [nft/state.ts:42](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/nft/state.ts#L42)

NFT state tag.

***

### LEN

> `static` **LEN**: `number`

Defined in: [nft/state.ts:52](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/nft/state.ts#L52)

***

### schema

> `static` **schema**: `object`

Defined in: [nft/state.ts:54](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/nft/state.ts#L54)

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

##### struct.nftMint

> **nftMint**: `object`

##### struct.nftMint.array

> **array**: `object`

##### struct.nftMint.array.len

> **len**: `number` = `32`

##### struct.nftMint.array.type

> **type**: `string` = `"u8"`

##### struct.nonce

> **nonce**: `string` = `"u8"`

##### struct.owner

> **owner**: `object`

##### struct.owner.array

> **array**: `object`

##### struct.owner.array.len

> **len**: `number` = `32`

##### struct.owner.array.type

> **type**: `string` = `"u8"`

##### struct.tag

> **tag**: `string` = `"u8"`

## Methods

### deserialize()

> `static` **deserialize**(`data`): `NftRecord`

Defined in: [nft/state.ts:73](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/nft/state.ts#L73)

Deserializes raw name-tokenizer account data.

#### Parameters

##### data

`Buffer`

#### Returns

`NftRecord`

***

### findKey()

> `static` **findKey**(`nameAccount`, `programId`): `Promise`\<\[`PublicKey`, `number`\]\>

Defined in: [nft/state.ts:88](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/nft/state.ts#L88)

Derives the asynchronous PDA for a name-tokenizer record.

#### Parameters

##### nameAccount

`PublicKey`

##### programId

`PublicKey`

#### Returns

`Promise`\<\[`PublicKey`, `number`\]\>

***

### findKeySync()

> `static` **findKeySync**(`nameAccount`, `programId`): \[`PublicKey`, `number`\]

Defined in: [nft/state.ts:95](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/nft/state.ts#L95)

Derives the synchronous PDA for a name-tokenizer record.

#### Parameters

##### nameAccount

`PublicKey`

##### programId

`PublicKey`

#### Returns

\[`PublicKey`, `number`\]

***

### retrieve()

> `static` **retrieve**(`connection`, `key`): `Promise`\<`NftRecord`\>

Defined in: [nft/state.ts:78](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/nft/state.ts#L78)

Fetches and deserializes a name-tokenizer record account.

#### Parameters

##### connection

`Connection`

##### key

`PublicKey`

#### Returns

`Promise`\<`NftRecord`\>
