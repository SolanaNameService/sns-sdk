---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Utilities](../index.md) / getReverseKeySync

# Function: getReverseKeySync()

> **getReverseKeySync**(`domain`, `isSub?`): `PublicKey`

Defined in: [utils/getReverseKeySync.ts:21](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/utils/getReverseKeySync.ts#L21)

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
