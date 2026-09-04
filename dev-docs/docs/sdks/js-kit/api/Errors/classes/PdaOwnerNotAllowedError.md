---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Errors](../index.md) / PdaOwnerNotAllowedError

# Class: PdaOwnerNotAllowedError

Defined in: [errors.ts:179](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/errors.ts#L179)

Thrown when a program-derived address is not an allowed owner.

## Extends

- [`SNSError`](SNSError.md)

## Constructors

### Constructor

> **new PdaOwnerNotAllowedError**(`message?`): `PdaOwnerNotAllowedError`

Defined in: [errors.ts:180](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/errors.ts#L180)

#### Parameters

##### message?

`string`

#### Returns

`PdaOwnerNotAllowedError`

#### Overrides

[`SNSError`](SNSError.md).[`constructor`](SNSError.md#constructor)

## Properties

### type

> **type**: [`ErrorType`](../enumerations/ErrorType.md)

Defined in: [errors.ts:39](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/errors.ts#L39)

#### Inherited from

[`SNSError`](SNSError.md).[`type`](SNSError.md#type)
