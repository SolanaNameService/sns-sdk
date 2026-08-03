---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [States](../index.md) / NftStateParams

# Interface: NftStateParams

Defined in: [states/nft.ts:32](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/states/nft.ts#L32)

Input for decoding an SNS NFT account.

## Example

```ts
const params: NftStateParams = { tag: 2, nonce: 0, nameAccount, owner, nftMint };
```

## Properties

### nameAccount

> **nameAccount**: `Uint8Array`

Defined in: [states/nft.ts:38](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/states/nft.ts#L38)

Encoded SNS domain account address.

***

### nftMint

> **nftMint**: `Uint8Array`

Defined in: [states/nft.ts:42](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/states/nft.ts#L42)

Encoded NFT mint address.

***

### nonce

> **nonce**: `number`

Defined in: [states/nft.ts:36](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/states/nft.ts#L36)

NFT record nonce.

***

### owner

> **owner**: `Uint8Array`

Defined in: [states/nft.ts:40](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/states/nft.ts#L40)

Encoded NFT owner address.

***

### tag

> **tag**: `number`

Defined in: [states/nft.ts:34](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/states/nft.ts#L34)

NFT state tag.
