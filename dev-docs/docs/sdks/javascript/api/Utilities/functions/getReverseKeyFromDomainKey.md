---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Utilities](../index.md) / getReverseKeyFromDomainKey

# Function: getReverseKeyFromDomainKey()

> **getReverseKeyFromDomainKey**(`domainKey`, `parent?`): `PublicKey`

Defined in: [utils/getReverseKeyFromDomainKey.ts:19](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getReverseKeyFromDomainKey.ts#L19)

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
