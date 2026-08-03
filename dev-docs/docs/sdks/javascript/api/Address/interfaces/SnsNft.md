---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Address](../index.md) / SnsNft

# Interface: SnsNft

Defined in: [utils/getSnsNftsForOwner.ts:14](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/utils/getSnsNftsForOwner.ts#L14)

A tokenized SNS domain and its associated NFT mint.

## Example

```ts
const firstDomain: SnsNft | undefined = domains[0];
```

## Properties

### domain

> **domain**: `string`

Defined in: [utils/getSnsNftsForOwner.ts:16](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/utils/getSnsNftsForOwner.ts#L16)

Fully qualified `.sns` domain name.

***

### key

> **key**: `PublicKey`

Defined in: [utils/getSnsNftsForOwner.ts:19](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/utils/getSnsNftsForOwner.ts#L19)

Name-service account address for `domain`.

***

### mint

> **mint**: `PublicKey`

Defined in: [utils/getSnsNftsForOwner.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/utils/getSnsNftsForOwner.ts#L22)

NFT mint that tokenizes `domain`.
