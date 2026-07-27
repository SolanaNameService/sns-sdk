---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Errors](../index.md) / SNSError

# Class: SNSError

Defined in: [errors.ts:38](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/errors.ts#L38)

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
- [`SnsSolResolutionMismatchError`](SnsSolResolutionMismatchError.md)

## Constructors

### Constructor

> **new SNSError**(`type`, `message?`): `SNSError`

Defined in: [errors.ts:41](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/errors.ts#L41)

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

Defined in: [errors.ts:39](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/errors.ts#L39)
