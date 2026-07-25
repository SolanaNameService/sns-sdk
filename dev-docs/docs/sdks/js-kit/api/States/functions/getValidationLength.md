---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [States](../index.md) / getValidationLength

# Function: getValidationLength()

> **getValidationLength**(`validation`): `0` \| `20` \| `32`

Defined in: [states/record.ts:29](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/states/record.ts#L29)

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
