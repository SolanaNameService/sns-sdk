---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Utilities](../index.md) / getReverseKeySync

# Function: getReverseKeySync()

> **getReverseKeySync**(`domain`, `isSub?`): `PublicKey`

Defined in: [utils/getReverseKeySync.ts:21](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/utils/getReverseKeySync.ts#L21)

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
