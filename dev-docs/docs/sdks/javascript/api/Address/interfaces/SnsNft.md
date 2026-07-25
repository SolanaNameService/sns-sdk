---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Address](../index.md) / SnsNft

# Interface: SnsNft

Defined in: [utils/getSnsNftsForOwner.ts:14](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/utils/getSnsNftsForOwner.ts#L14)

A tokenized SNS domain and its associated NFT mint.

## Example

```ts
const firstDomain: SnsNft | undefined = domains[0];
```

## Properties

### domain

> **domain**: `string`

Defined in: [utils/getSnsNftsForOwner.ts:16](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/utils/getSnsNftsForOwner.ts#L16)

Fully qualified `.sns` domain name.

***

### key

> **key**: `PublicKey`

Defined in: [utils/getSnsNftsForOwner.ts:19](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/utils/getSnsNftsForOwner.ts#L19)

Name-service account address for `domain`.

***

### mint

> **mint**: `PublicKey`

Defined in: [utils/getSnsNftsForOwner.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/utils/getSnsNftsForOwner.ts#L22)

NFT mint that tokenizes `domain`.
