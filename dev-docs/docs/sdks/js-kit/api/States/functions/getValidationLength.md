---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [States](../index.md) / getValidationLength

# Function: getValidationLength()

> **getValidationLength**(`validation`): `0` \| `20` \| `32`

Defined in: [states/record.ts:29](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/states/record.ts#L29)

Returns the byte length of an identifier encoded for a validation mode.

## Parameters

### validation

[`Validation`](../../Types/enumerations/Validation.md)

## Returns

`0` \| `20` \| `32`

## Example

```ts
const length = getValidationLength(Validation.Solana);
```
