---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Utilities](../index.md) / getCustomBgKeys

# Function: getCustomBgKeys()

> **getCustomBgKeys**(`domain`, `customBg`): `object`

Defined in: [custom-bg.ts:33](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/custom-bg.ts#L33)

Derives the name account keys for a custom background.

## Parameters

### domain

`string`

Domain name with its TLD suffix trimmed

### customBg

[`CustomBg`](../../Types/enumerations/CustomBg.md)

Custom background identifier

## Returns

`object`

Custom background domain key and background entry key.

### bgKey

> **bgKey**: `PublicKey`

### domainKey

> **domainKey**: `PublicKey`

## Example

```ts
const keys = getCustomBgKeys("example", CustomBg.DegenPoet1);
```
