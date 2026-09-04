---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Errors](../index.md) / AccountDoesNotExistError

# Class: AccountDoesNotExistError

Defined in: [errors.ts:116](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/errors.ts#L116)

Thrown when a required on-chain account does not exist.

## Extends

- [`SNSError`](SNSError.md)

## Constructors

### Constructor

> **new AccountDoesNotExistError**(`message?`): `AccountDoesNotExistError`

Defined in: [errors.ts:117](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/errors.ts#L117)

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

Defined in: [errors.ts:39](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/errors.ts#L39)

#### Inherited from

[`SNSError`](SNSError.md).[`type`](SNSError.md#type)
