---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Address](../index.md) / GetSnsDomainsForAddressResult

# Interface: GetSnsDomainsForAddressResult

Defined in: [address/getSnsDomainsForAddress.ts:41](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/address/getSnsDomainsForAddress.ts#L41)

An SNS domain owned directly by a registry address.

## Example

```ts
const domain: GetSnsDomainsForAddressResult = {
  domain: "example",
  domainAddress,
};
```

## Properties

### domain

> **domain**: `string`

Defined in: [address/getSnsDomainsForAddress.ts:43](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/address/getSnsDomainsForAddress.ts#L43)

TLD-less domain name.

***

### domainAddress

> **domainAddress**: `Address`

Defined in: [address/getSnsDomainsForAddress.ts:45](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/address/getSnsDomainsForAddress.ts#L45)

Domain account address.
