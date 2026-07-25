---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Utilities](../index.md) / getReverseKeyFromDomainKey

# Function: getReverseKeyFromDomainKey()

> **getReverseKeyFromDomainKey**(`domainKey`, `parent?`): `PublicKey`

Defined in: [utils/getReverseKeyFromDomainKey.ts:19](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/utils/getReverseKeyFromDomainKey.ts#L19)

Derives the reverse lookup account for a domain account.

## Parameters

### domainKey

`PublicKey`

Domain account public key

### parent?

`PublicKey`

Optional parent name account for subdomain reverse lookups

## Returns

`PublicKey`

Reverse lookup account public key.

## Example

```ts
const key = getReverseKeyFromDomainKey(domainKey);
```
