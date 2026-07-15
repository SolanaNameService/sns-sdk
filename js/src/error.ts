export enum ErrorType {
  InvalidSubdomain = "InvalidSubdomain",
  PrimaryDomainNotFound = "PrimaryDomainNotFound",
  InvalidBufferLength = "InvalidBufferLength",
  U64Overflow = "U64Overflow",
  InvalidRecordData = "InvalidRecordData",
  InvalidEvmAddress = "InvalidEvmAddress",
  InvalidInjectiveAddress = "InvalidInjectiveAddress",
  InvalidARecord = "InvalidARecord",
  InvalidAAAARecord = "InvalidAAAARecord",
  InvalidRecordInput = "InvalidRecordInput",
  AccountDoesNotExist = "AccountDoesNotExist",
  MultipleRegistries = "MultipleRegistries",
  InvalidReverseTwitter = "InvalidReverseTwitter",
  NoAccountData = "NoAccountData",
  InvalidInput = "InvalidInput",
  InvalidDomain = "InvalidDomain",
  InvalidCustomBg = "InvalidCustomBackground",
  MissingVerifier = "MissingVerifier",
  PythFeedNotFound = "PythFeedNotFound",
  InvalidRoa = "InvalidRoa",
  InvalidParent = "InvalidParent",
  NftRecordNotFound = "NftRecordNotFound",
  PdaOwnerNotAllowed = "PdaOwnerNotAllowed",
  DomainDoesNotExist = "DomainDoesNotExist",
  RecordMalformed = "RecordMalformed",
  CouldNotFindNftOwner = "CouldNotFindNftOwner",
  WrongValidation = "WrongValidation",
  UnsupportedTld = "UnsupportedTld",
  DomainExpired = "DomainExpired",
  CouldNotFindSrsOwner = "CouldNotFindSrsOwner",
}

export class SNSError extends Error {
  type: ErrorType;

  constructor(type: ErrorType, message?: string) {
    super(message);
    this.name = "SNSError";
    this.type = type;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SNSError);
    }
  }
}

export class InvalidSubdomainError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.InvalidSubdomain, message);
  }
}

export class PrimaryDomainNotFoundError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.PrimaryDomainNotFound, message);
  }
}

export class InvalidBufferLengthError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.InvalidBufferLength, message);
  }
}

export class U64OverflowError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.U64Overflow, message);
  }
}

export class InvalidRecordDataError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.InvalidRecordData, message);
  }
}

export class InvalidEvmAddressError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.InvalidEvmAddress, message);
  }
}

export class InvalidInjectiveAddressError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.InvalidInjectiveAddress, message);
  }
}

export class InvalidARecordError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.InvalidARecord, message);
  }
}

export class InvalidAAAARecordError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.InvalidAAAARecord, message);
  }
}

export class InvalidRecordInputError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.InvalidRecordInput, message);
  }
}

export class AccountDoesNotExistError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.AccountDoesNotExist, message);
  }
}

export class MultipleRegistriesError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.MultipleRegistries, message);
  }
}
export class InvalidReverseTwitterError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.InvalidReverseTwitter, message);
  }
}

export class NoAccountDataError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.NoAccountData, message);
  }
}

export class InvalidInputError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.InvalidInput, message);
  }
}

export class InvalidDomainError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.InvalidDomain, message);
  }
}

export class InvalidCustomBgError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.InvalidCustomBg, message);
  }
}

export class MissingVerifierError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.MissingVerifier, message);
  }
}

export class PythFeedNotFoundError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.PythFeedNotFound, message);
  }
}

export class InvalidRoaError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.InvalidRoa, message);
  }
}

export class InvalidParentError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.InvalidParent, message);
  }
}

export class NftRecordNotFoundError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.NftRecordNotFound, message);
  }
}

export class PdaOwnerNotAllowed extends SNSError {
  constructor(message?: string) {
    super(ErrorType.PdaOwnerNotAllowed, message);
  }
}

export class DomainDoesNotExist extends SNSError {
  constructor(message?: string) {
    super(ErrorType.DomainDoesNotExist, message);
  }
}

export class RecordMalformed extends SNSError {
  constructor(message?: string) {
    super(ErrorType.RecordMalformed, message);
  }
}

export class CouldNotFindNftOwner extends SNSError {
  constructor(message?: string) {
    super(ErrorType.CouldNotFindNftOwner, message);
  }
}

export class WrongValidation extends SNSError {
  constructor(message?: string) {
    super(ErrorType.WrongValidation, message);
  }
}

export class UnsupportedTldError extends SNSError {
  constructor(message?: string) {
    super(ErrorType.UnsupportedTld, message);
  }
}

export class DomainExpired extends SNSError {
  constructor(message?: string) {
    super(ErrorType.DomainExpired, message);
  }
}

export class CouldNotFindSrsOwner extends SNSError {
  constructor(message?: string) {
    super(ErrorType.CouldNotFindSrsOwner, message);
  }
}
