/// All Registered Domains test for SNS SDK
/// Mirrors js/tests/all-registered.test.ts exactly
library;

import 'package:dotenv/dotenv.dart';
import 'package:sns_sdk/sns_sdk.dart';
import 'package:test/test.dart';

void main() {
  group('All registered domains', () {
    test('All registered', () async {
      // Load environment variables from .env file
      final env = DotEnv()..load(['.env']);
      final rpcUrl = env['RPC_URL'];

      if (rpcUrl == null || rpcUrl.isEmpty) {
        markTestSkipped('RPC_URL environment variable not set');
        return;
      }

      // Create connection with extended timeout for this intensive operation
      final connection = EnhancedSolanaRpcClient(
        rpcUrl,
        timeout: const Duration(minutes: 4), // Match the test timeout
      );

      // Get all registered domains
      final registered = await getAllRegisteredDomains(connection);
      expect(registered.length, greaterThan(130000));
    }, timeout: const Timeout(Duration(minutes: 4)));
  });
}
