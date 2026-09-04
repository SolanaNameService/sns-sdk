---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Errors](../index.md) / InvalidRoaError

# Class: InvalidRoaError

Defined in: [error.ts:169](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/error.ts#L169)

Base error for SDK failures, carrying a machine-readable [ErrorType](../enumerations/ErrorType.md).

## Extends

- [`SNSError`](SNSError.md)

## Constructors

### Constructor

> **new InvalidRoaError**(`message?`): `InvalidRoaError`

Defined in: [error.ts:170](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/error.ts#L170)

#### Parameters

##### message?

`string`

#### Returns

`InvalidRoaError`

#### Overrides

[`SNSError`](SNSError.md).[`constructor`](SNSError.md#constructor)

## Properties

### type

> **type**: [`ErrorType`](../enumerations/ErrorType.md)

Defined in: [error.ts:43](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/error.ts#L43)

Machine-readable error category.

#### Inherited from

[`SNSError`](SNSError.md).[`type`](SNSError.md#type)
