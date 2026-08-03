---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [States](../index.md) / getValidationLength

# Function: getValidationLength()

> **getValidationLength**(`validation`): `0` \| `20` \| `32`

Defined in: [states/record.ts:29](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/states/record.ts#L29)

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
