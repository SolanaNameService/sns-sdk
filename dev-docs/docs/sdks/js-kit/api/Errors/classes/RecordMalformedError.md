---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Errors](../index.md) / RecordMalformedError

# Class: RecordMalformedError

Defined in: [errors.ts:192](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/errors.ts#L192)

Thrown when serialized record data cannot be decoded safely.

## Extends

- [`SNSError`](SNSError.md)

## Constructors

### Constructor

> **new RecordMalformedError**(`message?`): `RecordMalformedError`

Defined in: [errors.ts:193](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/errors.ts#L193)

#### Parameters

##### message?

`string`

#### Returns

`RecordMalformedError`

#### Overrides

[`SNSError`](SNSError.md).[`constructor`](SNSError.md#constructor)

## Properties

### type

> **type**: [`ErrorType`](../enumerations/ErrorType.md)

Defined in: [errors.ts:38](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/errors.ts#L38)

#### Inherited from

[`SNSError`](SNSError.md).[`type`](SNSError.md#type)
