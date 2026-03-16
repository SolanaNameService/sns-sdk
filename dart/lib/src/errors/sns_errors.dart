/// SNS error definitions and hierarchical error system.
///
/// Provides comprehensive error handling for all SNS operations including
/// domain resolution, record management, and NFT operations.
library;

/// Enumeration of all possible SNS error types.
///
/// These error types correspond to various failure conditions in SNS operations:
/// - Domain resolution errors (domain not found, invalid format)
/// - Record errors (invalid data, unsupported types, malformed content)
/// - NFT errors (account not found, ownership issues)
/// - Validation errors (invalid signatures, PDA restrictions)
/// - Network errors (account fetch failures, RPC issues)
enum ErrorType {
  symbolNotFound('SymbolNotFound'),
  invalidSubdomain('InvalidSubdomain'),
  primaryDomainNotFound('PrimaryDomainNotFound'),
  missingParentOwner('MissingParentOwner'),
  u32Overflow('U32Overflow'),
  invalidBufferLength('InvalidBufferLength'),
  u64Overflow('U64Overflow'),
  noRecordData('NoRecordData'),
  invalidRecordData('InvalidRecordData'),
  unsupportedRecord('UnsupportedRecord'),
  invalidEvmAddress('InvalidEvmAddress'),
  invalidInjectiveAddress('InvalidInjectiveAddress'),
  invalidARecord('InvalidARecord'),
  invalidAAAARecord('InvalidAAAARecord'),
  invalidRecordInput('InvalidRecordInput'),
  invalidSignature('InvalidSignature'),
  accountDoesNotExist('AccountDoesNotExist'),
  multipleRegistries('MultipleRegistries'),
  invalidReverseTwitter('InvalidReverseTwitter'),
  noAccountData('NoAccountData'),
  invalidInput('InvalidInput'),
  invalidDomain('InvalidDomain'),
  invalidCustomBg('InvalidCustomBackground'),
  unsupportedSignature('UnsupportedSignature'),
  recordDoestNotSupportGuardianSig('RecordDoestNotSupportGuardianSig'),
  recordIsNotSigned('RecordIsNotSigned'),
  unsupportedSignatureType('UnsupportedSignatureType'),
  invalidSolRecordV2('InvalidSolRecordV2'),
  missingVerifier('MissingVerifier'),
  pythFeedNotFound('PythFeedNotFound'),
  invalidRoA('InvalidRoA'),
  invalidPda('InvalidPda'),
  invalidParent('InvalidParent'),
  nftAccountNotFound('NftRecordNotFound'),
  pdaOwnerNotAllowed('PdaOwnerNotAllowed'),
  staleRecord('StaleRecord'),
  unverifiedRecord('UnverifiedRecord'),
  domainDoesNotExist('DomainDoesNotExist'),
  recordMalformed('RecordMalformed'),
  couldNotFindNftOwner('CouldNotFindNftOwner'),
  invalidValidation('InvalidValidation'),
  invalidSerializedData('InvalidSerializedData');

  const ErrorType(this.value);

  final String value;

  @override
  String toString() => value;
}

/// Base class for all SNS-related errors
///
/// Provides a consistent error interface for all SNS operations.
/// All specific error types inherit from this base class.
class SnsError extends Error {
  /// Creates a new SNS error with the specified type and optional message
  SnsError(this.type, [this.customMessage]);

  /// The specific error type that occurred
  final ErrorType type;

  /// Optional custom error message providing additional context
  final String? customMessage;

  @override
  String toString() {
    final message = customMessage ?? type.value;
    return 'SnsError: $message';
  }
}

/// Symbol not found error
class SymbolNotFoundError extends SnsError {
  SymbolNotFoundError([String? message])
      : super(ErrorType.symbolNotFound, message);
}

/// Invalid subdomain error
class InvalidSubdomainError extends SnsError {
  InvalidSubdomainError([String? message])
      : super(ErrorType.invalidSubdomain, message);
}

/// Primary domain not found error
class PrimaryDomainNotFoundError extends SnsError {
  PrimaryDomainNotFoundError([String? message])
      : super(ErrorType.primaryDomainNotFound, message);
}

/// Missing parent owner error
class MissingParentOwnerError extends SnsError {
  MissingParentOwnerError([String? message])
      : super(ErrorType.missingParentOwner, message);
}

/// U32 overflow error
class U32OverflowError extends SnsError {
  U32OverflowError([String? message]) : super(ErrorType.u32Overflow, message);
}

/// Invalid buffer length error
class InvalidBufferLengthError extends SnsError {
  InvalidBufferLengthError([String? message])
      : super(ErrorType.invalidBufferLength, message);
}

/// U64 overflow error
class U64OverflowError extends SnsError {
  U64OverflowError([String? message]) : super(ErrorType.u64Overflow, message);
}

/// No record data error
class NoRecordDataError extends SnsError {
  NoRecordDataError([String? message]) : super(ErrorType.noRecordData, message);
}

/// Invalid record data error
class InvalidRecordDataError extends SnsError {
  InvalidRecordDataError([String? message])
      : super(ErrorType.invalidRecordData, message);
}

/// Unsupported record error
class UnsupportedRecordError extends SnsError {
  UnsupportedRecordError([String? message])
      : super(ErrorType.unsupportedRecord, message);
}

/// Invalid EVM address error
class InvalidEvmAddressError extends SnsError {
  InvalidEvmAddressError([String? message])
      : super(ErrorType.invalidEvmAddress, message);
}

/// Invalid Injective address error
class InvalidInjectiveAddressError extends SnsError {
  InvalidInjectiveAddressError([String? message])
      : super(ErrorType.invalidInjectiveAddress, message);
}

/// Invalid A record error
class InvalidARecordError extends SnsError {
  InvalidARecordError([String? message])
      : super(ErrorType.invalidARecord, message);
}

/// Invalid AAAA record error
class InvalidAAAARecordError extends SnsError {
  InvalidAAAARecordError([String? message])
      : super(ErrorType.invalidAAAARecord, message);
}

/// Invalid record input error
class InvalidRecordInputError extends SnsError {
  InvalidRecordInputError([String? message])
      : super(ErrorType.invalidRecordInput, message);
}

/// Invalid signature error
class InvalidSignatureError extends SnsError {
  InvalidSignatureError([String? message])
      : super(ErrorType.invalidSignature, message);
}

/// Account does not exist error
class AccountDoesNotExistError extends SnsError {
  AccountDoesNotExistError([String? message])
      : super(ErrorType.accountDoesNotExist, message);
}

/// Multiple registries error
class MultipleRegistriesError extends SnsError {
  MultipleRegistriesError([String? message])
      : super(ErrorType.multipleRegistries, message);
}

/// Invalid reverse Twitter error
class InvalidReverseTwitterError extends SnsError {
  InvalidReverseTwitterError([String? message])
      : super(ErrorType.invalidReverseTwitter, message);
}

/// No account data error
class NoAccountDataError extends SnsError {
  NoAccountDataError([String? message])
      : super(ErrorType.noAccountData, message);
}

/// Invalid input error
class InvalidInputError extends SnsError {
  InvalidInputError([String? message]) : super(ErrorType.invalidInput, message);
}

/// Invalid domain error
class InvalidDomainError extends SnsError {
  InvalidDomainError([String? message])
      : super(ErrorType.invalidDomain, message);
}

/// Invalid custom background error
class InvalidCustomBgError extends SnsError {
  InvalidCustomBgError([String? message])
      : super(ErrorType.invalidCustomBg, message);
}

/// Unsupported signature error
class UnsupportedSignatureError extends SnsError {
  UnsupportedSignatureError([String? message])
      : super(ErrorType.unsupportedSignature, message);
}

/// Record does not support guardian signature error
class RecordDoestNotSupportGuardianSigError extends SnsError {
  RecordDoestNotSupportGuardianSigError([String? message])
      : super(ErrorType.recordDoestNotSupportGuardianSig, message);
}

/// Record is not signed error
class RecordIsNotSignedError extends SnsError {
  RecordIsNotSignedError([String? message])
      : super(ErrorType.recordIsNotSigned, message);
}

/// Unsupported signature type error
class UnsupportedSignatureTypeError extends SnsError {
  UnsupportedSignatureTypeError([String? message])
      : super(ErrorType.unsupportedSignatureType, message);
}

/// Invalid SOL record V2 error
class InvalidSolRecordV2Error extends SnsError {
  InvalidSolRecordV2Error([String? message])
      : super(ErrorType.invalidSolRecordV2, message);
}

/// Missing verifier error
class MissingVerifierError extends SnsError {
  MissingVerifierError([String? message])
      : super(ErrorType.missingVerifier, message);
}

/// Pyth feed not found error
class PythFeedNotFoundError extends SnsError {
  PythFeedNotFoundError([String? message])
      : super(ErrorType.pythFeedNotFound, message);
}

/// Invalid RoA error
class InvalidRoAError extends SnsError {
  InvalidRoAError([String? message]) : super(ErrorType.invalidRoA, message);
}

/// Invalid PDA error
class InvalidPdaError extends SnsError {
  InvalidPdaError([String? message]) : super(ErrorType.invalidPda, message);
}

/// Invalid parent error
class InvalidParentError extends SnsError {
  InvalidParentError([String? message])
      : super(ErrorType.invalidParent, message);
}

/// NFT account not found error
class NftAccountNotFoundError extends SnsError {
  NftAccountNotFoundError([String? message])
      : super(ErrorType.nftAccountNotFound, message);
}

/// PDA owner not allowed error
class PdaOwnerNotAllowedError extends SnsError {
  PdaOwnerNotAllowedError([String? message])
      : super(ErrorType.pdaOwnerNotAllowed, message);
}

/// Domain does not exist error
class DomainDoesNotExistError extends SnsError {
  DomainDoesNotExistError([String? message])
      : super(ErrorType.domainDoesNotExist, message);
}

/// Record malformed error
class RecordMalformedError extends SnsError {
  RecordMalformedError([String? message])
      : super(ErrorType.recordMalformed, message);
}

/// Could not find NFT owner error
class CouldNotFindNftOwnerError extends SnsError {
  CouldNotFindNftOwnerError([String? message])
      : super(ErrorType.couldNotFindNftOwner, message);
}

/// Invalid validation error
class InvalidValidationError extends SnsError {
  InvalidValidationError([String? message])
      : super(ErrorType.invalidValidation, message);
}

/// Invalid serialized data error
class InvalidSerializedDataError extends SnsError {
  InvalidSerializedDataError([String? message])
      : super(ErrorType.invalidSerializedData, message);
}

/// Stale record error
class StaleRecordError extends SnsError {
  StaleRecordError([String? message]) : super(ErrorType.staleRecord, message);
}

/// Unverified record error
class UnverifiedRecordError extends SnsError {
  UnverifiedRecordError([String? message])
      : super(ErrorType.unverifiedRecord, message);
}
