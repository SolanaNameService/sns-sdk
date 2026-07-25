---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Errors](../index.md) / SNSError

# Class: SNSError

Defined in: [error.ts:40](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/error.ts#L40)

Base error for SDK failures, carrying a machine-readable [ErrorType](../enumerations/ErrorType.md).

## Extends

- `Error`

## Extended by

- [`InvalidSubdomainError`](InvalidSubdomainError.md)
- [`PrimaryDomainNotFoundError`](PrimaryDomainNotFoundError.md)
- [`InvalidBufferLengthError`](InvalidBufferLengthError.md)
- [`U64OverflowError`](U64OverflowError.md)
- [`InvalidRecordDataError`](InvalidRecordDataError.md)
- [`InvalidEvmAddressError`](InvalidEvmAddressError.md)
- [`InvalidInjectiveAddressError`](InvalidInjectiveAddressError.md)
- [`InvalidARecordError`](InvalidARecordError.md)
- [`InvalidAAAARecordError`](InvalidAAAARecordError.md)
- [`InvalidRecordInputError`](InvalidRecordInputError.md)
- [`AccountDoesNotExistError`](AccountDoesNotExistError.md)
- [`MultipleRegistriesError`](MultipleRegistriesError.md)
- [`InvalidReverseTwitterError`](InvalidReverseTwitterError.md)
- [`NoAccountDataError`](NoAccountDataError.md)
- [`InvalidInputError`](InvalidInputError.md)
- [`InvalidDomainError`](InvalidDomainError.md)
- [`InvalidCustomBgError`](InvalidCustomBgError.md)
- [`MissingVerifierError`](MissingVerifierError.md)
- [`PythFeedNotFoundError`](PythFeedNotFoundError.md)
- [`InvalidRoaError`](InvalidRoaError.md)
- [`InvalidParentError`](InvalidParentError.md)
- [`NftRecordNotFoundError`](NftRecordNotFoundError.md)
- [`PdaOwnerNotAllowed`](PdaOwnerNotAllowed.md)
- [`DomainDoesNotExist`](DomainDoesNotExist.md)
- [`RecordMalformed`](RecordMalformed.md)
- [`CouldNotFindNftOwner`](CouldNotFindNftOwner.md)
- [`WrongValidation`](WrongValidation.md)
- [`UnsupportedTldError`](UnsupportedTldError.md)
- [`DomainExpired`](DomainExpired.md)
- [`CouldNotFindSrsOwner`](CouldNotFindSrsOwner.md)

## Constructors

### Constructor

> **new SNSError**(`type`, `message?`): `SNSError`

Defined in: [error.ts:44](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/error.ts#L44)

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

Defined in: [error.ts:42](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/error.ts#L42)

Machine-readable error category.
