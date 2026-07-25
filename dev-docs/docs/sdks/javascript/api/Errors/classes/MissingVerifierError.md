---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Errors](../index.md) / MissingVerifierError

# Class: MissingVerifierError

Defined in: [error.ts:156](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/error.ts#L156)

Base error for SDK failures, carrying a machine-readable [ErrorType](../enumerations/ErrorType.md).

## Extends

- [`SNSError`](SNSError.md)

## Constructors

### Constructor

> **new MissingVerifierError**(`message?`): `MissingVerifierError`

Defined in: [error.ts:157](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/error.ts#L157)

#### Parameters

##### message?

`string`

#### Returns

`MissingVerifierError`

#### Overrides

[`SNSError`](SNSError.md).[`constructor`](SNSError.md#constructor)

## Properties

### type

> **type**: [`ErrorType`](../enumerations/ErrorType.md)

Defined in: [error.ts:42](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/error.ts#L42)

Machine-readable error category.

#### Inherited from

[`SNSError`](SNSError.md).[`type`](SNSError.md#type)
