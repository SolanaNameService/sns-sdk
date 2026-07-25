---
title: "Errors API"
sidebar_label: "Errors"
hide_title: true
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../index.md) / Errors

# Errors

Error classes and stable error categories emitted by SDK operations.

## Enumerations

| Enumeration | Description |
| ------ | ------ |
| [ErrorType](enumerations/ErrorType.md) | Stable error codes emitted by SNS SDK operations. |

## Classes

| Class | Description |
| ------ | ------ |
| [AccountDoesNotExistError](classes/AccountDoesNotExistError.md) | Thrown when a required on-chain account does not exist. |
| [CouldNotFindNftOwnerError](classes/CouldNotFindNftOwnerError.md) | Thrown when the owner of an SNS NFT cannot be determined. |
| [CouldNotFindSrsOwnerError](classes/CouldNotFindSrsOwnerError.md) | Thrown when a Solana Registration Service domain owner cannot be resolved. |
| [DomainDoesNotExistError](classes/DomainDoesNotExistError.md) | Thrown when a requested SNS domain account does not exist. |
| [DomainExpiredError](classes/DomainExpiredError.md) | Thrown when a Solana Registration Service domain has expired. |
| [InvalidAAAARecordError](classes/InvalidAAAARecordError.md) | Thrown when an IPv6 record value is invalid. |
| [InvalidARecordError](classes/InvalidARecordError.md) | Thrown when an IPv4 record value is invalid. |
| [InvalidDomainError](classes/InvalidDomainError.md) | Thrown when a domain name is malformed or invalid. |
| [InvalidEvmAddressError](classes/InvalidEvmAddressError.md) | Thrown when an EVM address is invalid for a record operation. |
| [InvalidInjectiveAddressError](classes/InvalidInjectiveAddressError.md) | Thrown when an Injective address is invalid for a record operation. |
| [InvalidInputError](classes/InvalidInputError.md) | Thrown when a general SDK input contract is not met. |
| [InvalidParentError](classes/InvalidParentError.md) | Thrown when a required parent domain account cannot be resolved. |
| [InvalidRecordDataError](classes/InvalidRecordDataError.md) | Thrown when record content fails format validation. |
| [InvalidRecordInputError](classes/InvalidRecordInputError.md) | Thrown when record creation or update input is incomplete or invalid. |
| [InvalidRoaError](classes/InvalidRoaError.md) | Thrown when a Right of Association proof is invalid. |
| [InvalidSerializedDataError](classes/InvalidSerializedDataError.md) | Thrown when serialized account or record data is inconsistent. |
| [InvalidSubdomainError](classes/InvalidSubdomainError.md) | Thrown when a subdomain name is malformed or unsupported. |
| [InvalidValidationError](classes/InvalidValidationError.md) | Thrown when an unsupported record validation mode is encountered. |
| [MissingVerifierError](classes/MissingVerifierError.md) | Thrown when required record verification data is missing. |
| [NftAccountNotFoundError](classes/NftAccountNotFoundError.md) | Thrown when an expected SNS NFT account cannot be found. |
| [NoAccountDataError](classes/NoAccountDataError.md) | Thrown when an existing account has no readable data. |
| [NoRecordDataError](classes/NoRecordDataError.md) | Thrown when a requested record account has no readable data. |
| [PdaOwnerNotAllowedError](classes/PdaOwnerNotAllowedError.md) | Thrown when a program-derived address is not an allowed owner. |
| [PrimaryDomainNotFoundError](classes/PrimaryDomainNotFoundError.md) | Thrown when an address has no configured primary domain. |
| [PythFeedNotFoundError](classes/PythFeedNotFoundError.md) | Thrown when no Pyth price feed is configured for a mint. |
| [RecordMalformedError](classes/RecordMalformedError.md) | Thrown when serialized record data cannot be decoded safely. |
| [SNSError](classes/SNSError.md) | Base error thrown by SNS SDK operations. Inspect `type` for a stable error code. |
| [UnsupportedTldError](classes/UnsupportedTldError.md) | Thrown when a domain does not use a supported top-level domain. |
