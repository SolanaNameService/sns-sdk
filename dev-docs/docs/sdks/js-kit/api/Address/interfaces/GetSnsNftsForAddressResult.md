---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Address](../index.md) / GetSnsNftsForAddressResult

# Interface: GetSnsNftsForAddressResult

Defined in: [address/getSnsNftsForAddress.ts:41](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/address/getSnsNftsForAddress.ts#L41)

An SNS domain NFT owned by an address.

## Example

```ts
const domain: GetSnsNftsForAddressResult = {
  domain: "example",
  domainAddress,
  mint,
};
```

## Properties

### domain

> **domain**: `string`

Defined in: [address/getSnsNftsForAddress.ts:43](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/address/getSnsNftsForAddress.ts#L43)

TLD-less domain name.

***

### domainAddress

> **domainAddress**: `Address`

Defined in: [address/getSnsNftsForAddress.ts:45](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/address/getSnsNftsForAddress.ts#L45)

Domain account address.

***

### mint

> **mint**: `Address`

Defined in: [address/getSnsNftsForAddress.ts:47](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/address/getSnsNftsForAddress.ts#L47)

NFT mint address.
