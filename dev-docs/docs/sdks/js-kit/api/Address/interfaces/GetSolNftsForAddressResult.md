---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Address](../index.md) / GetSolNftsForAddressResult

# Interface: GetSolNftsForAddressResult

Defined in: [address/getSolNftsForAddress.ts:65](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/address/getSolNftsForAddress.ts#L65)

A tokenized `.sol` domain and its associated NFT mint.

## Example

```ts
const domain: GetSolNftsForAddressResult = {
  domain: "example",
  domainAddress,
  mint,
};
```

## Properties

### domain

> **domain**: `string`

Defined in: [address/getSolNftsForAddress.ts:67](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/address/getSolNftsForAddress.ts#L67)

TLD-trimmed `.sol` domain name.

***

### domainAddress

> **domainAddress**: `Address`

Defined in: [address/getSolNftsForAddress.ts:69](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/address/getSolNftsForAddress.ts#L69)

SRS record address.

***

### mint

> **mint**: `Address`

Defined in: [address/getSolNftsForAddress.ts:71](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/address/getSolNftsForAddress.ts#L71)

Token-2022 mint address.
