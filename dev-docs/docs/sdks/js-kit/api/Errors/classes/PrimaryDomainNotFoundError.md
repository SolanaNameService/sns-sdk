---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Errors](../index.md) / PrimaryDomainNotFoundError

# Class: PrimaryDomainNotFoundError

Defined in: [errors.ts:60](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/errors.ts#L60)

Thrown when an address has no configured primary domain.

## Extends

- [`SNSError`](SNSError.md)

## Constructors

### Constructor

> **new PrimaryDomainNotFoundError**(`message?`): `PrimaryDomainNotFoundError`

Defined in: [errors.ts:61](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/errors.ts#L61)

#### Parameters

##### message?

`string`

#### Returns

`PrimaryDomainNotFoundError`

#### Overrides

[`SNSError`](SNSError.md).[`constructor`](SNSError.md#constructor)

## Properties

### type

> **type**: [`ErrorType`](../enumerations/ErrorType.md)

Defined in: [errors.ts:39](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/errors.ts#L39)

#### Inherited from

[`SNSError`](SNSError.md).[`type`](SNSError.md#type)
