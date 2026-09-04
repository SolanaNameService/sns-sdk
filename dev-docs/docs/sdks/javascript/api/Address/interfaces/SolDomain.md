---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Address](../index.md) / SolDomain

# Interface: SolDomain

Defined in: [utils/getSolDomainsForOwner.ts:28](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getSolDomainsForOwner.ts#L28)

A directly registry-owned top-level `.sol` domain.

## Example

```ts
const domain: SolDomain = {
  domain: "example",
  key: nameAccount,
};
```

## Properties

### domain

> **domain**: `string`

Defined in: [utils/getSolDomainsForOwner.ts:30](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getSolDomainsForOwner.ts#L30)

TLD-trimmed `.sol` domain name.

***

### key

> **key**: `PublicKey`

Defined in: [utils/getSolDomainsForOwner.ts:32](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getSolDomainsForOwner.ts#L32)

SRS record address for `domain`.
