---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Errors](../index.md) / PythFeedNotFoundError

# Class: PythFeedNotFoundError

Defined in: [errors.ts:150](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/errors.ts#L150)

Thrown when no Pyth price feed is configured for a mint.

## Extends

- [`SNSError`](SNSError.md)

## Constructors

### Constructor

> **new PythFeedNotFoundError**(`message?`): `PythFeedNotFoundError`

Defined in: [errors.ts:151](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/errors.ts#L151)

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

Defined in: [errors.ts:38](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/errors.ts#L38)

#### Inherited from

[`SNSError`](SNSError.md).[`type`](SNSError.md#type)
