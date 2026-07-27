/**
 * Error classes and stable error categories emitted by SDK operations.
 * @module Errors
 */
/** Stable error codes emitted by SNS SDK operations. */
export enum ErrorType {
  InvalidSubdomain = "InvalidSubdomain",
  PrimaryDomainNotFound = "PrimaryDomainNotFound",
  NoRecordData = "NoRecordData",
  InvalidRecordData = "InvalidRecordData",
  InvalidEvmAddress = "InvalidEvmAddress",
  InvalidInjectiveAddress = "InvalidInjectiveAddress",
  InvalidARecord = "InvalidARecord",
  InvalidAAAARecord = "InvalidAAAARecord",
  InvalidRecordInput = "InvalidRecordInput",
  AccountDoesNotExist = "AccountDoesNotExist",
  NoAccountData = "NoAccountData",
  InvalidInput = "InvalidInput",
  InvalidDomain = "InvalidDomain",
  MissingVerifier = "MissingVerifier",
  PythFeedNotFound = "PythFeedNotFound",
  InvalidRoa = "InvalidRoa",
  InvalidParent = "InvalidParent",
  NftAccountNotFound = "NftRecordNotFound",
  PdaOwnerNotAllowed = "PdaOwnerNotAllowed",
  DomainDoesNotExist = "DomainDoesNotExist",
  RecordMalformed = "RecordMalformed",
  CouldNotFindNftOwner = "CouldNotFindNftOwner",
  InvalidValidation = "InvalidValidation",
  InvalidSerializedData = "InvalidSerializedData",
  UnsupportedTld = "UnsupportedTld",
  DomainExpired = "DomainExpired",
  CouldNotFindSrsOwner = "CouldNotFindSrsOwner",
  SnsSolResolutionMismatch = "SnsSolResolutionMismatch",
}

/** Base error thrown by SNS SDK operations. Inspect `type` for a stable error code. */
export class SNSError extends Error {
  type: ErrorType;

  constructor(type: ErrorType, message?: string) {
    super(message);
    this.name = "SNSError";
    this.type = type;

    if ((Error as any).captureStackTrace) {
      (Error as any).captureStackTrace(this, SNSError);
    }
  }
}

/** Thrown when a subdomain name is malformed or unsupported. */
export class InvalidSubdomainError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.InvalidSubdomain, message);
  }
}

/** Thrown when an address has no configured primary domain. */
export class PrimaryDomainNotFoundError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.PrimaryDomainNotFound, message);
  }
}

/** Thrown when a requested record account has no readable data. */
export class NoRecordDataError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.NoRecordData, message);
  }
}

/** Thrown when record content fails format validation. */
export class InvalidRecordDataError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.InvalidRecordData, message);
  }
}

/** Thrown when an EVM address is invalid for a record operation. */
export class InvalidEvmAddressError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.InvalidEvmAddress, message);
  }
}

/** Thrown when an Injective address is invalid for a record operation. */
export class InvalidInjectiveAddressError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.InvalidInjectiveAddress, message);
  }
}

/** Thrown when an IPv4 record value is invalid. */
export class InvalidARecordError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.InvalidARecord, message);
  }
}

/** Thrown when an IPv6 record value is invalid. */
export class InvalidAAAARecordError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.InvalidAAAARecord, message);
  }
}

/** Thrown when record creation or update input is incomplete or invalid. */
export class InvalidRecordInputError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.InvalidRecordInput, message);
  }
}

/** Thrown when a required on-chain account does not exist. */
export class AccountDoesNotExistError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.AccountDoesNotExist, message);
  }
}

/** Thrown when an existing account has no readable data. */
export class NoAccountDataError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.NoAccountData, message);
  }
}

/** Thrown when a general SDK input contract is not met. */
export class InvalidInputError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.InvalidInput, message);
  }
}

/** Thrown when a domain name is malformed or invalid. */
export class InvalidDomainError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.InvalidDomain, message);
  }
}

/** Thrown when required record verification data is missing. */
export class MissingVerifierError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.MissingVerifier, message);
  }
}

/** Thrown when no Pyth price feed is configured for a mint. */
export class PythFeedNotFoundError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.PythFeedNotFound, message);
  }
}

/** Thrown when a Right of Association proof is invalid. */
export class InvalidRoaError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.InvalidRoa, message);
  }
}

/** Thrown when a required parent domain account cannot be resolved. */
export class InvalidParentError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.InvalidParent, message);
  }
}

/** Thrown when an expected SNS NFT account cannot be found. */
export class NftAccountNotFoundError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.NftAccountNotFound, message);
  }
}

/** Thrown when a program-derived address is not an allowed owner. */
export class PdaOwnerNotAllowedError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.PdaOwnerNotAllowed, message);
  }
}

/** Thrown when a requested SNS domain account does not exist. */
export class DomainDoesNotExistError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.DomainDoesNotExist, message);
  }
}

/** Thrown when serialized record data cannot be decoded safely. */
export class RecordMalformedError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.RecordMalformed, message);
  }
}

/** Thrown when the owner of an SNS NFT cannot be determined. */
export class CouldNotFindNftOwnerError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.CouldNotFindNftOwner, message);
  }
}

/** Thrown when an unsupported record validation mode is encountered. */
export class InvalidValidationError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.InvalidValidation, message);
  }
}

/** Thrown when serialized account or record data is inconsistent. */
export class InvalidSerializedDataError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.InvalidSerializedData, message);
  }
}

/** Thrown when a domain does not use a supported top-level domain. */
export class UnsupportedTldError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.UnsupportedTld, message);
  }
}

/** Thrown when a Solana Registration Service domain has expired. */
export class DomainExpiredError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.DomainExpired, message);
  }
}

/** Thrown when a Solana Registration Service domain owner cannot be resolved. */
export class CouldNotFindSrsOwnerError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.CouldNotFindSrsOwner, message);
  }
}

/** Thrown when .sns and .sol resolve the same domain to different addresses. */
export class SnsSolResolutionMismatchError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.SnsSolResolutionMismatch, message);
  }
}
