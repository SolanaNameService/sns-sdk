---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / checkAddressOnCurve

# Function: checkAddressOnCurve()

> **checkAddressOnCurve**(`address`): `boolean`

Defined in: [utils/checkAddressOnCurve/index.ts:36](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/utils/checkAddressOnCurve/index.ts#L36)

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
