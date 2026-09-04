---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Errors](../index.md) / InvalidSubdomainError

# Class: InvalidSubdomainError

Defined in: [errors.ts:53](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/errors.ts#L53)

Thrown when a subdomain name is malformed or unsupported.

## Extends

- [`SNSError`](SNSError.md)

## Constructors

### Constructor

> **new InvalidSubdomainError**(`message?`): `InvalidSubdomainError`

Defined in: [errors.ts:54](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/errors.ts#L54)

#### Parameters

##### message?

`string`

#### Returns

`InvalidSubdomainError`

#### Overrides

[`SNSError`](SNSError.md).[`constructor`](SNSError.md#constructor)

## Properties

### type

> **type**: [`ErrorType`](../enumerations/ErrorType.md)

Defined in: [errors.ts:39](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/errors.ts#L39)

#### Inherited from

[`SNSError`](SNSError.md).[`type`](SNSError.md#type)
