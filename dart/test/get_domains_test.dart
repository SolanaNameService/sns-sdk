/// Get domains test for SNS SDK
/// Mirrors js/tests/get-domains.test.ts exactly
library;

import 'dart:io';

import 'package:sns_sdk/sns_sdk.dart';
import 'package:solana/solana.dart' hide RpcClient;
import 'package:test/test.dart';
import 'real_rpc_client.dart';

void main() {
  group('Get domains', () {
    late RpcClient rpc;

    setUpAll(() {
      // Check if RPC URL is provided
      final rpcUrl = Platform.environment['RPC_URL'];

      if (rpcUrl == null) {
        // Skipping Get domains tests: RPC_URL environment variable not set
        return;
      }

      rpc = createRealRpcClient();
    });

    test('Get domains', () async {
      // Skip if no RPC client
      final rpcUrl = Platform.environment['RPC_URL'];
      if (rpcUrl == null) {
        return;
      }

      // Test data from JS test
      final testUser = Ed25519HDPublicKey.fromBase58(
          'Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8');
      final expectedDomains = [
        '2NsGScxHd9bS6gA7tfY3xucCcg6H9qDqLdXLtAYFjCVR',
        '6Yi9GyJKoFAv77pny4nxBqYYwFaAZ8dNPZX9HDXw5Ctw',
        '8XXesVR1EEsCEePAEyXPL9A4dd9Bayhu9MRkFBpTkibS',
        '9wcWEXmtUbmiAaWdhQ1nSaZ1cmDVdbYNbaeDcKoK5H8r',
        'CZFQJkE2uBqdwHH53kBT6UStyfcbCWzh6WHwRRtaLgrm',
        'ChkcdTKgyVsrLuD9zkUBoUkZ1GdZjTHEmgh5dhnR4haT',
      ]..sort();

      // Get domains for the test user using the utils version
      final domains = await getAllDomains(rpc, testUser);
      final domainStrings = domains.map((e) => e.toBase58()).toList()..sort();

      // Compare with expected results
      expect(domainStrings, equals(expectedDomains));
    });
  });
}
