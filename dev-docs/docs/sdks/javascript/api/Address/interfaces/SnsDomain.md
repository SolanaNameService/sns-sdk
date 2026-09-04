---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Address](../index.md) / SnsDomain

# Interface: SnsDomain

Defined in: [utils/getSnsDomainsForOwner.ts:17](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getSnsDomainsForOwner.ts#L17)

A directly registry-owned top-level `.sns` domain.

## Example

```ts
const domain: SnsDomain = {
  domain: "example",
  key: nameAccount,
};
```

## Properties

### domain

> **domain**: `string`

Defined in: [utils/getSnsDomainsForOwner.ts:19](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getSnsDomainsForOwner.ts#L19)

TLD-trimmed `.sns` domain name.

***

### key

> **key**: `PublicKey`

Defined in: [utils/getSnsDomainsForOwner.ts:21](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getSnsDomainsForOwner.ts#L21)

Name-service account address for `domain`.
