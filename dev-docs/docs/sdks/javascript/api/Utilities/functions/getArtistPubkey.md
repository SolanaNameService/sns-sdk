---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Utilities](../index.md) / getArtistPubkey

# Function: getArtistPubkey()

> **getArtistPubkey**(`bg`): `PublicKey`

Defined in: [custom-bg.ts:58](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/custom-bg.ts#L58)

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
