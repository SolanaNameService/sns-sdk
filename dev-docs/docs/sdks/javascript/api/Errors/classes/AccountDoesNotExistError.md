---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Errors](../index.md) / AccountDoesNotExistError

# Class: AccountDoesNotExistError

Defined in: [error.ts:115](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/error.ts#L115)

Base error for SDK failures, carrying a machine-readable [ErrorType](../enumerations/ErrorType.md).

## Extends

- [`SNSError`](SNSError.md)

## Constructors

### Constructor

> **new AccountDoesNotExistError**(`message?`): `AccountDoesNotExistError`

Defined in: [error.ts:116](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/error.ts#L116)

#### Parameters

##### message?

`string`

#### Returns

`AccountDoesNotExistError`

#### Overrides

[`SNSError`](SNSError.md).[`constructor`](SNSError.md#constructor)

## Properties

### type

> **type**: [`ErrorType`](../enumerations/ErrorType.md)

Defined in: [error.ts:42](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/error.ts#L42)

Machine-readable error category.

#### Inherited from

[`SNSError`](SNSError.md).[`type`](SNSError.md#type)
