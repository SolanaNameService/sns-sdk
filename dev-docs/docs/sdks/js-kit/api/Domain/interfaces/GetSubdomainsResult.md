---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetSubdomainsResult

# Interface: GetSubdomainsResult

Defined in: [domain/getSubdomains.ts:48](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/domain/getSubdomains.ts#L48)

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

Defined in: [domain/getSubdomains.ts:52](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/domain/getSubdomains.ts#L52)

Owner address stored in the subdomain's name registry account.

***

### subdomain

> **subdomain**: `string`

Defined in: [domain/getSubdomains.ts:50](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/domain/getSubdomains.ts#L50)

TLD-less label recorded by the subdomain's reverse lookup account.
