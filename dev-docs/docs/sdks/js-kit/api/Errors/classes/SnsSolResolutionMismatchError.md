---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Errors](../index.md) / SnsSolResolutionMismatchError

# Class: SnsSolResolutionMismatchError

Defined in: [errors.ts:242](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/errors.ts#L242)

Thrown when .sns and .sol resolve the same domain to different addresses.

## Extends

- [`SNSError`](SNSError.md)

## Constructors

### Constructor

> **new SnsSolResolutionMismatchError**(`message?`): `SnsSolResolutionMismatchError`

Defined in: [errors.ts:243](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/errors.ts#L243)

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

Defined in: [errors.ts:39](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/errors.ts#L39)

#### Inherited from

[`SNSError`](SNSError.md).[`type`](SNSError.md#type)
