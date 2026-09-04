---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Address](../index.md) / SnsNft

# Interface: SnsNft

Defined in: [utils/getSnsNftsForOwner.ts:18](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getSnsNftsForOwner.ts#L18)

A tokenized `.sns` domain and its associated NFT mint.

## Example

```ts
const nft: SnsNft = {
  domain: "example",
  key: nameAccount,
  mint: nftMint,
};
```

## Properties

### domain

> **domain**: `string`

Defined in: [utils/getSnsNftsForOwner.ts:20](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getSnsNftsForOwner.ts#L20)

TLD-trimmed `.sns` domain name.

***

### key

> **key**: `PublicKey`

Defined in: [utils/getSnsNftsForOwner.ts:22](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getSnsNftsForOwner.ts#L22)

Name-service account address for `domain`.

***

### mint

> **mint**: `PublicKey`

Defined in: [utils/getSnsNftsForOwner.ts:24](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getSnsNftsForOwner.ts#L24)

NFT mint that tokenizes `domain`.
