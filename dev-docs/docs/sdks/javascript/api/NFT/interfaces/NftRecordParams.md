---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [NFT](../index.md) / NftRecordParams

# Interface: NftRecordParams

Defined in: [nft/state.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/nft/state.ts#L26)

Input for decoding a name-tokenizer record.

## Example

```ts
const params: NftRecordParams = { tag: 2, nonce: 0, nameAccount, owner, nftMint };
```

## Properties

### nameAccount

> **nameAccount**: `Uint8Array`

Defined in: [nft/state.ts:32](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/nft/state.ts#L32)

Encoded SNS domain account address.

***

### nftMint

> **nftMint**: `Uint8Array`

Defined in: [nft/state.ts:36](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/nft/state.ts#L36)

Encoded NFT mint address.

***

### nonce

> **nonce**: `number`

Defined in: [nft/state.ts:30](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/nft/state.ts#L30)

NFT record nonce.

***

### owner

> **owner**: `Uint8Array`

Defined in: [nft/state.ts:34](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/nft/state.ts#L34)

Encoded NFT owner address.

***

### tag

> **tag**: `number`

Defined in: [nft/state.ts:28](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/nft/state.ts#L28)

NFT state tag.
