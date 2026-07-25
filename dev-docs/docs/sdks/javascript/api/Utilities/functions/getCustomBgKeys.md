---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Utilities](../index.md) / getCustomBgKeys

# Function: getCustomBgKeys()

> **getCustomBgKeys**(`domain`, `customBg`): `object`

Defined in: [custom-bg.ts:33](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/custom-bg.ts#L33)

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
