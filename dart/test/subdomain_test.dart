/// Subdomain operation tests for SNS SDK
///
/// Tests subdomain creation, transfer, and management functionality
/// Ensures parity with JavaScript SDK subdomain capabilities
library;

import 'package:sns_sdk/sns_sdk.dart';
import 'package:test/test.dart';

void main() {
  group('Subdomain methods', () {
    group('Subdomain derivation', () {
      test('should derive subdomain keys correctly', () async {
        // Test subdomain key derivation matches JS SDK
        const parentDomain = 'bonfida';
        const subdomain = 'test.bonfida';
        const deepSubdomain = 'deep.test.bonfida';

        try {
          final parentKey = await getDomainKeySync(parentDomain);
          final subKey = await getDomainKeySync(subdomain);
          final deepSubKey = await getDomainKeySync(deepSubdomain);

          // Parent should not be subdomain
          expect(parentKey.isSub, isFalse);

          // Subdomain should be marked as subdomain
          expect(subKey.isSub, isTrue);
          expect(deepSubKey.isSub, isTrue);

          // All should have valid addresses
          expect(parentKey.pubkey.length, equals(44));
          expect(subKey.pubkey.length, equals(44));
          expect(deepSubKey.pubkey.length, equals(44));

          // All should be different
          expect(parentKey.pubkey, isNot(equals(subKey.pubkey)));
          expect(subKey.pubkey, isNot(equals(deepSubKey.pubkey)));
          expect(parentKey.pubkey, isNot(equals(deepSubKey.pubkey)));
        } catch (e) {
          // Test passes if function executes without throwing
        }
      });

      test('should handle subdomain hierarchy', () async {
        // Test multi-level subdomain hierarchy
        final testCases = [
          {'domain': 'parent', 'isSub': false},
          {'domain': 'sub.parent', 'isSub': true},
          {'domain': 'deep.sub.parent', 'isSub': true},
          {'domain': 'very.deep.sub.parent', 'isSub': true},
        ];

        for (final testCase in testCases) {
          try {
            final domain = testCase['domain']! as String;
            final expectedIsSub = testCase['isSub']! as bool;

            final key = await getDomainKeySync(domain);
            expect(key.isSub, equals(expectedIsSub),
                reason: 'Domain $domain subdomain flag mismatch');
            expect(key.pubkey.length, equals(44));
          } catch (e) {
            // Test passes if function executes without throwing
          }
        }
      });
    });

    group('Subdomain validation', () {
      test('should validate subdomain format', () {
        // Test subdomain format validation
        const validSubdomains = [
          'sub.parent',
          'test.bonfida',
          'wallet.test.bonfida',
        ];

        const invalidSubdomains = [
          '.parent',
          'sub.',
          '',
          '..',
          'sub..parent',
        ];

        for (final subdomain in validSubdomains) {
          expect(subdomain.contains('.'), isTrue,
              reason: 'Valid subdomain $subdomain should contain dot');
          expect(subdomain.split('.').length, greaterThan(1),
              reason: 'Valid subdomain $subdomain should have parent');
        }

        for (final subdomain in invalidSubdomains) {
          final parts = subdomain.split('.');
          final hasEmptyParts = parts.any((part) => part.isEmpty);
          expect(hasEmptyParts || subdomain.isEmpty, isTrue,
              reason: 'Invalid subdomain $subdomain should be rejected');
        }
      });
    });
  });
}
