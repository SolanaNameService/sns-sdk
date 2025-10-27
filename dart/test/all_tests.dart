/// All tests runner for SNS SDK
///
/// This file serves as documentation of all available test suites.
/// Use `dart test` to run all tests automatically.
/// Mirrors the test structure of the JavaScript SDK
library;

import 'package:test/test.dart';

void main() {
  group('SNS SDK Test Suite', () {
    test('Test suite documentation', () {
      // This is a documentation test that lists all available test files
      const testFiles = [
        'address_test.dart - Address derivation and validation tests',
        'binding_test.dart - Transaction binding tests',
        'comprehensive_test.dart - Comprehensive integration tests',
        'core_functionality_test.dart - Core functionality tests',
        'derivation_test.dart - Domain derivation tests',
        'domain_test.dart - Domain operation tests',
        'js_dart_parity_test.dart - JavaScript/Dart parity tests',
        'nft_test.dart - NFT operation tests',
        'record_test.dart - Record management tests',
        'record_v2_test.dart - Record v2 management tests',
        'registration_test.dart - Domain registration tests',
        'resolve_test.dart - Domain resolution tests',
        'reverse_lookup_test.dart - Reverse lookup tests',
        'serialization_test.dart - Serialization/deserialization tests',
        'subdomain_test.dart - Subdomain operation tests',
        'utils_test.dart - Utility function tests',
        'validation_test.dart - Validation logic tests',
      ];

      expect(testFiles.length, greaterThan(15));
      expect(testFiles.first, contains('address_test.dart'));
    });
  });
}
