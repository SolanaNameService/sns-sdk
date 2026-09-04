---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Domain](../index.md) / getSolDomainKeySync

# Function: getSolDomainKeySync()

> **getSolDomainKeySync**(`domain`): `object`

Defined in: [utils/getSolDomainKeySync.ts:40](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getSolDomainKeySync.ts#L40)

Derives the canonical SRS record account for a `.sol` domain.

The caller must trim the `.sol` TLD suffix before calling this function.

## Parameters

### domain

`string`

Domain name with the `.sol` TLD suffix trimmed

## Returns

`object`

Canonical SRS record public key and the seed used to derive it

### hashed

> **hashed**: `Buffer`

### pubkey

> **pubkey**: `PublicKey`

## Throws

When the current record seed exceeds 32 bytes

## Example

```ts
const { pubkey } = getSolDomainKeySync("example");
```
