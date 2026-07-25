---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [States](../index.md) / getValidationLength

# Function: getValidationLength()

> **getValidationLength**(`validation`): `0` \| `20` \| `32`

Defined in: [states/record.ts:29](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/states/record.ts#L29)

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
