---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / checkAddressOnCurve

# Function: checkAddressOnCurve()

> **checkAddressOnCurve**(`address`): `boolean`

Defined in: [utils/checkAddressOnCurve/index.ts:36](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/utils/checkAddressOnCurve/index.ts#L36)

Returns whether a Solana address represents a valid Ed25519 curve point.

## Parameters

### address

`Address`

Solana address to validate

## Returns

`boolean`

Whether the address is an Ed25519 curve point

## Example

```ts
const onCurve = checkAddressOnCurve(address);
```
