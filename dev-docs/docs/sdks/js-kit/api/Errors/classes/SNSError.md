---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Errors](../index.md) / SNSError

# Class: SNSError

Defined in: [errors.ts:37](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/errors.ts#L37)

Base error thrown by SNS SDK operations. Inspect `type` for a stable error code.

## Extends

- `Error`

## Extended by

- [`InvalidSubdomainError`](InvalidSubdomainError.md)
- [`PrimaryDomainNotFoundError`](PrimaryDomainNotFoundError.md)
- [`NoRecordDataError`](NoRecordDataError.md)
- [`InvalidRecordDataError`](InvalidRecordDataError.md)
- [`InvalidEvmAddressError`](InvalidEvmAddressError.md)
- [`InvalidInjectiveAddressError`](InvalidInjectiveAddressError.md)
- [`InvalidARecordError`](InvalidARecordError.md)
- [`InvalidAAAARecordError`](InvalidAAAARecordError.md)
- [`InvalidRecordInputError`](InvalidRecordInputError.md)
- [`AccountDoesNotExistError`](AccountDoesNotExistError.md)
- [`NoAccountDataError`](NoAccountDataError.md)
- [`InvalidInputError`](InvalidInputError.md)
- [`InvalidDomainError`](InvalidDomainError.md)
- [`MissingVerifierError`](MissingVerifierError.md)
- [`PythFeedNotFoundError`](PythFeedNotFoundError.md)
- [`InvalidRoaError`](InvalidRoaError.md)
- [`InvalidParentError`](InvalidParentError.md)
- [`NftAccountNotFoundError`](NftAccountNotFoundError.md)
- [`PdaOwnerNotAllowedError`](PdaOwnerNotAllowedError.md)
- [`DomainDoesNotExistError`](DomainDoesNotExistError.md)
- [`RecordMalformedError`](RecordMalformedError.md)
- [`CouldNotFindNftOwnerError`](CouldNotFindNftOwnerError.md)
- [`InvalidValidationError`](InvalidValidationError.md)
- [`InvalidSerializedDataError`](InvalidSerializedDataError.md)
- [`UnsupportedTldError`](UnsupportedTldError.md)
- [`DomainExpiredError`](DomainExpiredError.md)
- [`CouldNotFindSrsOwnerError`](CouldNotFindSrsOwnerError.md)

## Constructors

### Constructor

> **new SNSError**(`type`, `message?`): `SNSError`

Defined in: [errors.ts:40](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/errors.ts#L40)

#### Parameters

##### type

[`ErrorType`](../enumerations/ErrorType.md)

##### message?

`string`

#### Returns

`SNSError`

#### Overrides

`Error.constructor`

## Properties

### type

> **type**: [`ErrorType`](../enumerations/ErrorType.md)

Defined in: [errors.ts:38](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/errors.ts#L38)
