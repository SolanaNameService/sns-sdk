---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Address](../index.md) / SolNft

# Interface: SolNft

Defined in: [utils/getSolNftsForOwner.ts:44](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getSolNftsForOwner.ts#L44)

A tokenized `.sol` domain and its associated NFT mint.

## Example

```ts
const nft: SolNft = {
  domain: "example",
  key: nameAccount,
  mint: nftMint,
};
```

## Properties

### domain

> **domain**: `string`

Defined in: [utils/getSolNftsForOwner.ts:46](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getSolNftsForOwner.ts#L46)

TLD-trimmed `.sol` domain name.

***

### key

> **key**: `PublicKey`

Defined in: [utils/getSolNftsForOwner.ts:48](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getSolNftsForOwner.ts#L48)

SRS record account address for `domain`.

***

### mint

> **mint**: `PublicKey`

Defined in: [utils/getSolNftsForOwner.ts:50](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getSolNftsForOwner.ts#L50)

NFT mint that tokenizes `domain`.
