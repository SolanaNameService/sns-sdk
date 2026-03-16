/// Get Domain Price From Name test for SNS SDK
/// Mirrors js/tests/get-domain-price-from-name.test.ts exactly
library;

import 'package:sns_sdk/sns_sdk.dart';
import 'package:test/test.dart';

void main() {
  group('getDomainPriceFromName', () {
    final testCases = [
      ['1', 750],
      ['✅', 750],
      ['요', 750],
      ['👩‍👩‍👧', 750],
      ['10', 700],
      ['1✅', 700],
      ['👩‍👩‍👧✅', 700],
      ['독도', 700],
      ['100', 640],
      ['10✅', 640],
      ['1독도', 640],
      ['1000', 160],
      ['100✅', 160],
      ['10000', 20],
      ['1000✅', 20],
      ['fêtes', 20],
    ];

    for (final testCase in testCases) {
      final domain = testCase[0] as String;
      final expectedPrice = testCase[1] as int;

      test('value $domain to be $expectedPrice', () {
        final price = getDomainPriceFromName(domain);
        expect(price, equals(expectedPrice));
      });
    }
  });
}
