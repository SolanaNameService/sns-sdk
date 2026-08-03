---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetSnsDomainAddressResult

# Interface: GetSnsDomainAddressResult

Defined in: [domain/getSnsDomainAddress.ts:37](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/domain/getSnsDomainAddress.ts#L37)

A derived SNS domain address.

## Example

```ts
const derived: GetSnsDomainAddressResult = {
  domainAddress,
  isSub: false,
};
```

## Properties

### domainAddress

> **domainAddress**: `Address`

Defined in: [domain/getSnsDomainAddress.ts:39](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/domain/getSnsDomainAddress.ts#L39)

Derived account address.

***

### isSub

> **isSub**: `boolean`

Defined in: [domain/getSnsDomainAddress.ts:43](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/domain/getSnsDomainAddress.ts#L43)

Whether the input is a subdomain.

***

### isSubRecord?

> `optional` **isSubRecord?**: `boolean`

Defined in: [domain/getSnsDomainAddress.ts:45](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/domain/getSnsDomainAddress.ts#L45)

Whether the input is a subdomain record.

***

### parentAddress?

> `optional` **parentAddress?**: `Address`

Defined in: [domain/getSnsDomainAddress.ts:41](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/domain/getSnsDomainAddress.ts#L41)

Parent domain address for subdomains.
