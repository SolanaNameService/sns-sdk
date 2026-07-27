---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [States](../index.md) / NftState

# Class: NftState

Defined in: [states/nft.ts:46](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/nft.ts#L46)

Decoded state of an SNS NFT account.

## Constructors

### Constructor

> **new NftState**(`obj`): `NftState`

Defined in: [states/nft.ts:76](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/nft.ts#L76)

#### Parameters

##### obj

[`NftStateParams`](../interfaces/NftStateParams.md)

#### Returns

`NftState`

## Properties

### nameAccount

> **nameAccount**: `Address`

Defined in: [states/nft.ts:52](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/nft.ts#L52)

SNS domain account address.

***

### nftMint

> **nftMint**: `Address`

Defined in: [states/nft.ts:56](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/nft.ts#L56)

NFT mint address.

***

### nonce

> **nonce**: `number`

Defined in: [states/nft.ts:50](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/nft.ts#L50)

NFT record nonce.

***

### owner

> **owner**: `Address`

Defined in: [states/nft.ts:54](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/nft.ts#L54)

NFT owner address.

***

### tag

> **tag**: [`NftTag`](../enumerations/NftTag.md)

Defined in: [states/nft.ts:48](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/nft.ts#L48)

NFT state tag.

***

### LEN

> `static` **LEN**: `number`

Defined in: [states/nft.ts:74](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/nft.ts#L74)

***

### schema

> `static` **schema**: `object`

Defined in: [states/nft.ts:58](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/nft.ts#L58)

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

> `static` **deserialize**(`data`): `NftState`

Defined in: [states/nft.ts:84](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/nft.ts#L84)

#### Parameters

##### data

`Uint8Array`

#### Returns

`NftState`

***

### getAddress()

> `static` **getAddress**(`domainAddress`): `Promise`\<`Address`\>

Defined in: [states/nft.ts:141](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/nft.ts#L141)

#### Parameters

##### domainAddress

`Address`

#### Returns

`Promise`\<`Address`\>

***

### retrieve()

> `static` **retrieve**(`rpc`, `address`): `Promise`\<`NftState`\>

Defined in: [states/nft.ts:94](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/nft.ts#L94)

#### Parameters

##### rpc

`Rpc`\<`GetAccountInfoApi`\>

##### address

`Address`

#### Returns

`Promise`\<`NftState`\>

***

### retrieveFromMint()

> `static` **retrieveFromMint**(`rpc`, `mint`): `Promise`\<`NftState`\>

Defined in: [states/nft.ts:105](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/nft.ts#L105)

#### Parameters

##### rpc

`Rpc`\<`GetProgramAccountsApi`\>

##### mint

`Address`

#### Returns

`Promise`\<`NftState`\>
