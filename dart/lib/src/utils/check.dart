import '../errors/sns_errors.dart';

/// Checks a boolean condition and throws a specified error if the condition is false.
/// This function is intended for internal use only.
///
/// [condition] - The boolean condition to check.
/// [error] - The error to be thrown if the condition is false.
///
/// Throws the specified error if the condition is false.
void check(bool condition, SnsError error) {
  if (!condition) {
    throw error;
  }
}
