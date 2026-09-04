---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Errors](../index.md) / InvalidSerializedDataError

# Class: InvalidSerializedDataError

Defined in: [errors.ts:214](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/errors.ts#L214)

Thrown when serialized account or record data is inconsistent.

## Extends

- [`SNSError`](SNSError.md)

## Constructors

### Constructor

> **new InvalidSerializedDataError**(`message?`): `InvalidSerializedDataError`

Defined in: [errors.ts:215](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/errors.ts#L215)

#### Parameters

##### message?

`string`

#### Returns

`InvalidSerializedDataError`

#### Overrides

[`SNSError`](SNSError.md).[`constructor`](SNSError.md#constructor)

## Properties

### type

> **type**: [`ErrorType`](../enumerations/ErrorType.md)

Defined in: [errors.ts:39](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/errors.ts#L39)

#### Inherited from

[`SNSError`](SNSError.md).[`type`](SNSError.md#type)
