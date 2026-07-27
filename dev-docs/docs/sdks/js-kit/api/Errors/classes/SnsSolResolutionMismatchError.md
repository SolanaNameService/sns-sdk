---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Errors](../index.md) / SnsSolResolutionMismatchError

# Class: SnsSolResolutionMismatchError

Defined in: [errors.ts:242](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/errors.ts#L242)

Thrown when .sns and .sol resolve the same domain to different addresses.

## Extends

- [`SNSError`](SNSError.md)

## Constructors

### Constructor

> **new SnsSolResolutionMismatchError**(`message?`): `SnsSolResolutionMismatchError`

Defined in: [errors.ts:243](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/errors.ts#L243)

#### Parameters

##### message?

`string`

#### Returns

`SnsSolResolutionMismatchError`

#### Overrides

[`SNSError`](SNSError.md).[`constructor`](SNSError.md#constructor)

## Properties

### type

> **type**: [`ErrorType`](../enumerations/ErrorType.md)

Defined in: [errors.ts:39](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/errors.ts#L39)

#### Inherited from

[`SNSError`](SNSError.md).[`type`](SNSError.md#type)
