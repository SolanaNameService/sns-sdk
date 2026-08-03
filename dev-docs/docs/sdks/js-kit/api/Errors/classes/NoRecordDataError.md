---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Errors](../index.md) / NoRecordDataError

# Class: NoRecordDataError

Defined in: [errors.ts:67](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/errors.ts#L67)

Thrown when a requested record account has no readable data.

## Extends

- [`SNSError`](SNSError.md)

## Constructors

### Constructor

> **new NoRecordDataError**(`message?`): `NoRecordDataError`

Defined in: [errors.ts:68](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/errors.ts#L68)

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

Defined in: [errors.ts:39](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/errors.ts#L39)

#### Inherited from

[`SNSError`](SNSError.md).[`type`](SNSError.md#type)
