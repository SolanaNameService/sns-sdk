---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Domain](../index.md) / getDomainPriceFromName

# Function: getDomainPriceFromName()

> **getDomainPriceFromName**(`name`): `20` \| `160` \| `640` \| `700` \| `750`

Defined in: [utils/getDomainPriceFromName.ts:14](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/utils/getDomainPriceFromName.ts#L14)

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
