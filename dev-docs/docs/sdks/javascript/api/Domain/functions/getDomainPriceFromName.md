---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Domain](../index.md) / getDomainPriceFromName

# Function: getDomainPriceFromName()

> **getDomainPriceFromName**(`name`): `20` \| `160` \| `640` \| `700` \| `750`

Defined in: [utils/getDomainPriceFromName.ts:14](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/utils/getDomainPriceFromName.ts#L14)

Retrieves the domain registration price in USD from a domain name.

## Parameters

### name

`string`

Domain name without suffix

## Returns

`20` \| `160` \| `640` \| `700` \| `750`

Registration price in USD.

## Example

```ts
const price = getDomainPriceFromName("example");
```
