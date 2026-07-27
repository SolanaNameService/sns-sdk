---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Errors](../index.md) / PythFeedNotFoundError

# Class: PythFeedNotFoundError

Defined in: [errors.ts:151](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/errors.ts#L151)

Thrown when no Pyth price feed is configured for a mint.

## Extends

- [`SNSError`](SNSError.md)

## Constructors

### Constructor

> **new PythFeedNotFoundError**(`message?`): `PythFeedNotFoundError`

Defined in: [errors.ts:152](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/errors.ts#L152)

#### Parameters

##### message?

`string`

#### Returns

`PythFeedNotFoundError`

#### Overrides

[`SNSError`](SNSError.md).[`constructor`](SNSError.md#constructor)

## Properties

### type

> **type**: [`ErrorType`](../enumerations/ErrorType.md)

Defined in: [errors.ts:39](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/errors.ts#L39)

#### Inherited from

[`SNSError`](SNSError.md).[`type`](SNSError.md#type)
