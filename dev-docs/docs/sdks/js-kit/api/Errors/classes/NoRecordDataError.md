---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Errors](../index.md) / NoRecordDataError

# Class: NoRecordDataError

Defined in: [errors.ts:66](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/errors.ts#L66)

Thrown when a requested record account has no readable data.

## Extends

- [`SNSError`](SNSError.md)

## Constructors

### Constructor

> **new NoRecordDataError**(`message?`): `NoRecordDataError`

Defined in: [errors.ts:67](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/errors.ts#L67)

#### Parameters

##### message?

`string`

#### Returns

`NoRecordDataError`

#### Overrides

[`SNSError`](SNSError.md).[`constructor`](SNSError.md#constructor)

## Properties

### type

> **type**: [`ErrorType`](../enumerations/ErrorType.md)

Defined in: [errors.ts:38](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/errors.ts#L38)

#### Inherited from

[`SNSError`](SNSError.md).[`type`](SNSError.md#type)
