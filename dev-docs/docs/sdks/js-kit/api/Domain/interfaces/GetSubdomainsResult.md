---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetSubdomainsResult

# Interface: GetSubdomainsResult

Defined in: [domain/getSubdomains.ts:48](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/domain/getSubdomains.ts#L48)

A subdomain and the owner recorded in its name registry.

## Example

```ts
const subdomain: GetSubdomainsResult = {
  subdomain: "blog",
  owner: "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8" as Address,
};
```

## Properties

### owner

> **owner**: `Address`

Defined in: [domain/getSubdomains.ts:52](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/domain/getSubdomains.ts#L52)

Owner address stored in the subdomain's name registry account.

***

### subdomain

> **subdomain**: `string`

Defined in: [domain/getSubdomains.ts:50](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/domain/getSubdomains.ts#L50)

TLD-less label recorded by the subdomain's reverse lookup account.
