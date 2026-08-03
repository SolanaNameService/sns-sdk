---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Errors](../index.md) / SNSError

# Class: SNSError

Defined in: [error.ts:41](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/error.ts#L41)

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
- [`SnsSolResolutionMismatchError`](SnsSolResolutionMismatchError.md)

## Constructors

### Constructor

> **new SNSError**(`type`, `message?`): `SNSError`

Defined in: [error.ts:45](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/error.ts#L45)

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

Defined in: [error.ts:43](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/error.ts#L43)

Machine-readable error category.
