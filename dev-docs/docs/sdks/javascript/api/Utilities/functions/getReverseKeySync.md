---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Utilities](../index.md) / getReverseKeySync

# Function: getReverseKeySync()

> **getReverseKeySync**(`domain`, `isSub?`): `PublicKey`

Defined in: [utils/getReverseKeySync.ts:21](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getReverseKeySync.ts#L21)

Derives the reverse lookup account for a domain name.

The caller must trim the TLD suffix before calling this function.

## Parameters

### domain

`string`

Domain name with its TLD suffix trimmed

### isSub?

`boolean`

Set to true when deriving a subdomain reverse account

## Returns

`PublicKey`

Reverse lookup account public key.

## Example

```ts
const key = getReverseKeySync("example");
```
