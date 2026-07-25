---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Utilities](../index.md) / getArtistPubkey

# Function: getArtistPubkey()

> **getArtistPubkey**(`bg`): `PublicKey`

Defined in: [custom-bg.ts:58](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/custom-bg.ts#L58)

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
