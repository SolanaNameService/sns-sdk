---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Errors](../index.md) / RecordMalformed

# Class: RecordMalformed

Defined in: [error.ts:198](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/error.ts#L198)

Base error for SDK failures, carrying a machine-readable [ErrorType](../enumerations/ErrorType.md).

## Extends

- [`SNSError`](SNSError.md)

## Constructors

### Constructor

> **new RecordMalformed**(`message?`): `RecordMalformed`

Defined in: [error.ts:199](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/error.ts#L199)

#### Parameters

##### message?

`string`

#### Returns

`RecordMalformed`

#### Overrides

[`SNSError`](SNSError.md).[`constructor`](SNSError.md#constructor)

## Properties

### type

> **type**: [`ErrorType`](../enumerations/ErrorType.md)

Defined in: [error.ts:42](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/error.ts#L42)

Machine-readable error category.

#### Inherited from

[`SNSError`](SNSError.md).[`type`](SNSError.md#type)
