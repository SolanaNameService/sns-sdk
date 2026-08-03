---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Utilities](../index.md) / getReverseKeyFromDomainKey

# Function: getReverseKeyFromDomainKey()

> **getReverseKeyFromDomainKey**(`domainKey`, `parent?`): `PublicKey`

Defined in: [utils/getReverseKeyFromDomainKey.ts:19](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/utils/getReverseKeyFromDomainKey.ts#L19)

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
