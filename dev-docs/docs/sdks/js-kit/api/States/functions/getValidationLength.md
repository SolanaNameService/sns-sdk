---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [States](../index.md) / getValidationLength

# Function: getValidationLength()

> **getValidationLength**(`validation`): `0` \| `20` \| `32`

Defined in: [states/record.ts:29](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/record.ts#L29)

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
