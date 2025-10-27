/// Resolve tests for SNS SDK
/// Mirrors js/tests/resolve.test.ts exactly
library;

import 'dart:io';
import 'package:dotenv/dotenv.dart';
import 'package:sns_sdk/sns_sdk.dart';
import 'package:test/test.dart';

import 'constants.dart';

void main() {
  group('resolve', () {
    late SnsClient connection;

    setUpAll(() {
      // Load environment like JavaScript tests do
      final envFile = File('.env');
      if (envFile.existsSync()) {
        final env = DotEnv();
        env.load(['.env']);
      }

      // Use same RPC URL as JavaScript tests
      final rpcUrl = testRpcUrl; // From constants.dart
      final rpc = EnhancedSolanaRpcClient(rpcUrl);
      connection = SnsClient(rpc);
    });

    // Test just one case first
    test('sns-ip-5-wallet-2 resolves correctly', () async {
      final resolvedValue = await resolve(connection, 'sns-ip-5-wallet-2');
      expect(resolvedValue,
          equals('AxwzQXhZNJb9zLyiHUQA12L2GL7CxvUNrp6neee6r3cA'));
    }, timeout: const Timeout(Duration(seconds: 50)));

    // Error test cases from JS
    final errorTestCases = [
      {
        'domain': 'sns-ip-5-wallet-3',
        'errorType': 'WrongValidation',
      },
      {
        'domain': 'sns-ip-5-wallet-6',
        'errorType': 'PdaOwnerNotAllowed',
      },
      {
        'domain': 'sns-ip-5-wallet-11',
        'errorType': 'PdaOwnerNotAllowed',
      },
      {
        'domain': 'sns-ip-5-wallet-12',
        'errorType': 'InvalidRoAError',
      },
    ];

    for (final testCase in errorTestCases) {
      test('${testCase['domain']} throws an error', () async {
        await expectLater(
          resolve(connection, testCase['domain'] as String),
          throwsA(isA<SnsError>()),
        );
      }, timeout: const Timeout(Duration(seconds: 50)));
    }

    // Backward compatibility test cases from JS
    final backwardCompatTestCases = [
      {
        'domain': 'wallet-guide-5.sol',
        'owner': 'Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8',
      },
      {
        'domain': 'wallet-guide-4.sol',
        'owner': 'Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ',
      },
      {
        'domain': 'wallet-guide-3.sol',
        'owner': 'Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8',
      },
      {
        'domain': 'wallet-guide-2.sol',
        'owner': '36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4',
      },
      {
        'domain': 'wallet-guide-1.sol',
        'owner': '36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4',
      },
      {
        'domain': 'wallet-guide-0.sol',
        'owner': 'Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8',
      },
      {
        'domain': 'sub-0.wallet-guide-3.sol',
        'owner': 'Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8',
      },
      {
        'domain': 'sub-1.wallet-guide-3.sol',
        'owner': 'Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ',
      },
      {
        'domain': 'wallet-guide-6',
        'owner': 'Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ',
      },
      {
        'domain': 'wallet-guide-8',
        'owner': '36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4',
      },
    ];

    for (final testCase in backwardCompatTestCases) {
      test('${testCase['domain']} backward compatibility', () async {
        final resolvedValue =
            await resolve(connection, testCase['domain'] as String);
        expect(resolvedValue, equals(testCase['owner']));
      }, timeout: const Timeout(Duration(seconds: 50)));
    }
  });
}
