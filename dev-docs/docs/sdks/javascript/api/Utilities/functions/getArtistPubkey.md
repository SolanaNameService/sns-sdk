---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Utilities](../index.md) / getArtistPubkey

# Function: getArtistPubkey()

> **getArtistPubkey**(`bg`): `PublicKey`

Defined in: [custom-bg.ts:58](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/custom-bg.ts#L58)

Returns the public key associated with a custom background.

## Parameters

### bg

[`CustomBg`](../../Types/enumerations/CustomBg.md)

The custom background identifier

## Returns

`PublicKey`

The artist or payout public key for the background

## Example

```ts
const artist = getArtistPubkey(CustomBg.DegenPoet1);
```
