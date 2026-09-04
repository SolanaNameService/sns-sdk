---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Utilities](../index.md) / check

# Function: check()

> **check**\<`T`\>(`bool`, `error`): `void`

Defined in: [utils/check.ts:15](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/check.ts#L15)

Throws `error` unless `bool` is true, preserving its concrete SNS error type.

## Type Parameters

### T

`T` *extends* [`SNSError`](../../Errors/classes/SNSError.md)

## Parameters

### bool

`boolean`

Condition that must be true

### error

`T`

Error to throw when `bool` is false

## Returns

`void`

## Throws

The supplied error when `bool` is false

## Example

```ts
check(value !== undefined, new InvalidInputError("A value is required"));
```
