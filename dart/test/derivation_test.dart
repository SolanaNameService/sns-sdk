/// Domain key derivation tests for SNS SDK
/// Mirrors js/tests/derivation.test.ts exactly
library;

import 'package:sns_sdk/sns_sdk.dart';
import 'package:test/test.dart';

import 'constants.dart';

void main() {
  group('Domain Key Derivation', () {
    test('Derivation - matches JavaScript SDK', () async {
      // Test all cases from JavaScript SDK derivation.test.ts
      for (final testCase in domainDerivationTestCases) {
        final domain = testCase['domain']!;
        final expectedAddress = testCase['address']!;

        // Test sync version (mirrors getDomainKeySync from JS)
        final syncResult = await getDomainKeySync(domain);
        expect(syncResult.pubkey, equals(expectedAddress),
            reason: 'Sync derivation failed for domain: $domain');
      }
    });

    test('Domain with and without .sol suffix should be identical', () async {
      // Test that both forms give the same result
      final withoutSol = await getDomainKeySync('bonfida');
      final withSol = await getDomainKeySync('bonfida.sol');

      expect(withoutSol.pubkey, equals(withSol.pubkey));
    });

    test('Subdomain derivation', () async {
      // Test subdomain derivation matches expected results
      final result = await getDomainKeySync('dex.bonfida');
      expect(result.pubkey,
          equals('HoFfFXqFHAC8RP3duuQNzag1ieUwJRBv1HtRNiWFq4Qu'));
      expect(result.isSub, isTrue);
    });
  });
}
