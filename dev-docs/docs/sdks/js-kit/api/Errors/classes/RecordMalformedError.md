---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Errors](../index.md) / RecordMalformedError

# Class: RecordMalformedError

Defined in: [errors.ts:193](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/errors.ts#L193)

Thrown when serialized record data cannot be decoded safely.

## Extends

- [`SNSError`](SNSError.md)

## Constructors

### Constructor

> **new RecordMalformedError**(`message?`): `RecordMalformedError`

Defined in: [errors.ts:194](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/errors.ts#L194)

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

Defined in: [errors.ts:39](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/errors.ts#L39)

#### Inherited from

[`SNSError`](SNSError.md).[`type`](SNSError.md#type)
