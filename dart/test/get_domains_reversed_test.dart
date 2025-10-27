/// Get domains reversed test for SNS SDK
/// Mirrors js/tests/get-domains-reversed.test.ts exactly
library;

import 'dart:io';

import 'package:sns_sdk/sns_sdk.dart';
import 'package:solana/solana.dart' hide RpcClient;
import 'package:test/test.dart';
import 'real_rpc_client.dart';

void main() {
  group('Get reversed domains', () {
    late RpcClient rpc;

    setUpAll(() {
      // Check if RPC URL is provided
      final rpcUrl = Platform.environment['RPC_URL'];

      if (rpcUrl == null) {
        // Skipping Get reversed domains tests: RPC_URL environment variable not set
        return;
      }

      rpc = createRealRpcClient();
    });

    test('Get reversed domains', () async {
      // Skip if no RPC client
      final rpcUrl = Platform.environment['RPC_URL'];
      if (rpcUrl == null) {
        return;
      }

      // Test data from JS test
      final testUser = Ed25519HDPublicKey.fromBase58(
          'Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8');

      final expectedPubKeys = [
        '9wcWEXmtUbmiAaWdhQ1nSaZ1cmDVdbYNbaeDcKoK5H8r',
        'CZFQJkE2uBqdwHH53kBT6UStyfcbCWzh6WHwRRtaLgrm',
        'ChkcdTKgyVsrLuD9zkUBoUkZ1GdZjTHEmgh5dhnR4haT',
        '2NsGScxHd9bS6gA7tfY3xucCcg6H9qDqLdXLtAYFjCVR',
        '6Yi9GyJKoFAv77pny4nxBqYYwFaAZ8dNPZX9HDXw5Ctw',
        '8XXesVR1EEsCEePAEyXPL9A4dd9Bayhu9MRkFBpTkibS',
      ];

      final expectedDomains = [
        'wallet-guide-10',
        'wallet-guide-3',
        'wallet-guide-4',
        'wallet-guide-6',
        'wallet-guide-7',
        'wallet-guide-9',
      ];

      // Get domains with reverses for the test user
      final domains = await getDomainKeysWithReverses(rpc, testUser);

      // Sort by domain name (same as JS test)
      domains.sort((a, b) => (a.domain ?? '').compareTo(b.domain ?? ''));

      // Verify length matches
      expect(domains.length, equals(expectedDomains.length));

      // Compare each domain and pubkey
      for (var i = 0; i < domains.length; i++) {
        expect(domains[i].domain, equals(expectedDomains[i]));
        expect(domains[i].pubKey.toBase58(), equals(expectedPubKeys[i]));
      }
    });
  });
}
