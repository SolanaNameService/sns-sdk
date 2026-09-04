---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetSubdomainsResult

# Interface: GetSubdomainsResult

Defined in: [domain/getSubdomains.ts:47](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getSubdomains.ts#L47)

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

Defined in: [domain/getSubdomains.ts:51](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getSubdomains.ts#L51)

Owner address stored in the subdomain's name registry account.

***

### subdomain

> **subdomain**: `string`

Defined in: [domain/getSubdomains.ts:49](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getSubdomains.ts#L49)

TLD-less label recorded by the subdomain's reverse lookup account.
