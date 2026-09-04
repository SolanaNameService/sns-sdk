---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Address](../index.md) / GetSolDomainsForAddressResult

# Interface: GetSolDomainsForAddressResult

Defined in: [address/getSolDomainsForAddress.ts:50](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/address/getSolDomainsForAddress.ts#L50)

A directly wallet-owned SRS `.sol` domain.

## Example

```ts
const domain: GetSolDomainsForAddressResult = {
  domain: "example",
  domainAddress,
};
```

## Properties

### domain

> **domain**: `string`

Defined in: [address/getSolDomainsForAddress.ts:52](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/address/getSolDomainsForAddress.ts#L52)

TLD-trimmed `.sol` domain name.

***

### domainAddress

> **domainAddress**: `Address`

Defined in: [address/getSolDomainsForAddress.ts:54](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/address/getSolDomainsForAddress.ts#L54)

SRS record address.
