/// Reverse/Subdomain test for SNS SDK
/// Mirrors js/tests/reverse.test.ts exactly
library;

import 'dart:io';

import 'package:sns_sdk/sns_sdk.dart';
import 'package:solana/solana.dart' hide RpcClient;
import 'package:test/test.dart';
import 'real_rpc_client.dart';

void main() {
  group('Reverse', () {
    late RpcClient rpc;

    setUpAll(() {
      // Check if RPC URL is provided
      final rpcUrl = Platform.environment['RPC_URL'];

      if (rpcUrl == null) {
        // print('Skipping Reverse tests: RPC_URL environment variable not set');
        return;
      }

      rpc = createRealRpcClient();
    });

    test('Create sub', () async {
      // Skip if no RPC client
      final rpcUrl = Platform.environment['RPC_URL'];
      if (rpcUrl == null) {
        return;
      }

      const sub = 'gvbhnjklmjnhb';
      const parent = 'bonfida.sol';
      final fullDomain = '$sub.$parent';

      // First resolve the parent domain to get its owner
      final parentOwner = await resolveDomain(rpc, parent);

      // Create subdomain instruction
      final instructions = await createSubdomain(CreateSubdomainParams(
        rpc: rpc,
        subdomain: fullDomain,
        parentOwner: Ed25519HDPublicKey.fromBase58(parentOwner),
        ttl: 86400, // 1 day TTL
      ));

      // Verify instructions were created successfully
      expect(instructions, isNotNull);
      expect(instructions, isNotEmpty);

      // Verify the first instruction is valid
      expect(instructions.first, isA<TransactionInstruction>());

      // print('Subdomain creation instruction test passed');
    });
  });
}
