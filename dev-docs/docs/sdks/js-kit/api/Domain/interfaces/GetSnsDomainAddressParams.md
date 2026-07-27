---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetSnsDomainAddressParams

# Interface: GetSnsDomainAddressParams

Defined in: [domain/getSnsDomainAddress.ts:19](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/domain/getSnsDomainAddress.ts#L19)

Parameters for deriving an SNS domain address.

## Example

```ts
const params: GetSnsDomainAddressParams = { domain: "example" };
```

## Properties

### domain

> **domain**: `string`

Defined in: [domain/getSnsDomainAddress.ts:21](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/domain/getSnsDomainAddress.ts#L21)

TLD-less domain name.

***

### record?

> `optional` **record?**: [`RecordVersion`](../../Types/enumerations/RecordVersion.md)

Defined in: [domain/getSnsDomainAddress.ts:23](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/domain/getSnsDomainAddress.ts#L23)

Record version.
