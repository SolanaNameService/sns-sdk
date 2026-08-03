---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Address](../index.md) / GetPrimaryDomainResult

# Interface: GetPrimaryDomainResult

Defined in: [address/getPrimaryDomain.ts:44](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/address/getPrimaryDomain.ts#L44)

A wallet's primary domain.

## Example

```ts
const primary: GetPrimaryDomainResult = {
  domainAddress,
  domainName: "example",
  stale: false,
};
```

## Properties

### domainAddress

> **domainAddress**: `Address`

Defined in: [address/getPrimaryDomain.ts:46](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/address/getPrimaryDomain.ts#L46)

Primary domain account address.

***

### domainName

> **domainName**: `string`

Defined in: [address/getPrimaryDomain.ts:48](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/address/getPrimaryDomain.ts#L48)

TLD-less primary domain name.

***

### stale

> **stale**: `boolean`

Defined in: [address/getPrimaryDomain.ts:50](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/address/getPrimaryDomain.ts#L50)

Whether the wallet is no longer the domain's effective owner.
