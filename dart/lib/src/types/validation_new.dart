/// Validation type definitions for the SNS SDK
library;

/// Validation enumeration for records following JavaScript SDK
enum Validation {
  none(0),
  solana(1),
  ethereum(2),
  unverifiedSolana(3);

  const Validation(this.value);

  final int value;

  @override
  String toString() => 'Validation.$name';

  /// Create validation from integer value
  static Validation fromValue(int value) {
    switch (value) {
      case 0:
        return Validation.none;
      case 1:
        return Validation.solana;
      case 2:
        return Validation.ethereum;
      case 3:
        return Validation.unverifiedSolana;
      default:
        throw ArgumentError('Invalid validation value: $value');
    }
  }
}

/// Get the byte length for a validation type
///
/// Mirrors js-kit/src/states/record.ts getValidationLength function
int getValidationLength(Validation validation) {
  switch (validation) {
    case Validation.none:
      return 0;
    case Validation.ethereum:
      return 20;
    case Validation.solana:
    case Validation.unverifiedSolana:
      return 32;
  }
}

/// Get validation length from integer value
int getValidationLengthFromValue(int value) =>
    getValidationLength(Validation.fromValue(value));

/// Validation result containing validation type and associated data
class ValidationResult {
  const ValidationResult({
    required this.validation,
    required this.isValid,
    this.publicKey,
    this.signature,
  });
  final Validation validation;
  final String? publicKey;
  final String? signature;
  final bool isValid;

  ValidationResult copyWith({
    Validation? validation,
    String? publicKey,
    String? signature,
    bool? isValid,
  }) =>
      ValidationResult(
        validation: validation ?? this.validation,
        publicKey: publicKey ?? this.publicKey,
        signature: signature ?? this.signature,
        isValid: isValid ?? this.isValid,
      );

  @override
  String toString() =>
      'ValidationResult(validation: $validation, publicKey: $publicKey, '
      'signature: $signature, isValid: $isValid)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is ValidationResult &&
        other.validation == validation &&
        other.publicKey == publicKey &&
        other.signature == signature &&
        other.isValid == isValid;
  }

  @override
  int get hashCode => Object.hash(validation, publicKey, signature, isValid);
}
