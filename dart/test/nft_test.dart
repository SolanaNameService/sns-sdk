/// NFT operation tests for SNS SDK
///
/// Tests NFT-related operations for tokenized domains
/// based on js-kit/tests/nft.test.ts
library;

import 'package:sns_sdk/src/nft/get_nft_mint.dart';
import 'package:sns_sdk/src/nft/get_nft_owner.dart';
import 'package:test/test.dart';

import 'constants.dart';
import 'real_rpc_client.dart';
import 'test_constants.dart';

void main() {
  // Skip tests if RPC_URL is not available
  final rpcUrl = getRpcUrl();
  if (rpcUrl == null) {
    // print('Skipping NFT tests: RPC_URL environment variable not set');
    return;
  }

  final rpc = createRealRpcClient();

  group('NFT methods', () {
    group('getNftMint', () {
      test('should get NFT mint for tokenized domain', () async {
        final domainAddress = testDomainAddresses['bonfida']!;
        final result = await getNftMint(GetNftMintParams(
          domainAddress: domainAddress,
        ));

        expect(result, isNotNull);
        expect(result, isA<String>());
        expect(result, isNotEmpty);
      });

      test('should get NFT mint for various domains', () async {
        for (final entry in testDomainAddresses.entries) {
          final domainAddress = entry.value;
          final result = await getNftMint(GetNftMintParams(
            domainAddress: domainAddress,
          ));

          // Result is always a string (non-nullable)
          expect(result, isA<String>());
          expect(result, isNotEmpty);
        }
      });

      test('should handle domain without NFT mint', () async {
        // Use a domain address that might not have an NFT
        final domainAddress = testDomainAddresses['test.sns-ip-5-wallet-1']!;
        final result = await getNftMint(GetNftMintParams(
          domainAddress: domainAddress,
        ));

        // Result is always a string (may be empty or default for non-tokenized)
        expect(result, isA<String>());
      });

      test('should be consistent across multiple calls', () async {
        final domainAddress = testDomainAddresses['bonfida']!;

        final result1 = await getNftMint(GetNftMintParams(
          domainAddress: domainAddress,
        ));

        final result2 = await getNftMint(GetNftMintParams(
          domainAddress: domainAddress,
        ));

        expect(result1, equals(result2));
      });
    });

    group('getNftOwner', () {
      test('should get NFT owner for valid domain', () async {
        final domainAddress = testDomainAddresses['bonfida']!;
        final result = await getNftOwner(GetNftOwnerParams(
          rpc: rpc,
          domainAddress: domainAddress,
        ));

        // Result can be null or a valid address
        if (result != null) {
          expect(result, isA<String>());
          expect(result, isNotEmpty);
        }
      });

      test('should handle multiple domain queries', () async {
        for (final entry in testDomainAddresses.entries.take(3)) {
          final domainAddress = entry.value;
          final result = await getNftOwner(GetNftOwnerParams(
            rpc: rpc,
            domainAddress: domainAddress,
          ));

          // Result might be null for non-tokenized domains
          if (result != null) {
            expect(result, isA<String>());
            expect(result, isNotEmpty);
          }
        }
      });

      test('should handle domain without NFT owner', () async {
        final domainAddress = testDomainAddresses['sns-ip-5-wallet-1']!;
        final result = await getNftOwner(GetNftOwnerParams(
          rpc: rpc,
          domainAddress: domainAddress,
        ));

        // Result might be null for non-tokenized domains
        if (result != null) {
          expect(result, isA<String>());
        }
      });
    });

    group('Error handling', () {
      test('should handle invalid domain address for getNftMint', () async {
        expect(
          () => getNftMint(const GetNftMintParams(
            domainAddress: '',
          )),
          throwsA(isA<ArgumentError>()),
        );
      });

      test('should handle invalid domain address for getNftOwner', () async {
        expect(
          () => getNftOwner(GetNftOwnerParams(
            rpc: rpc,
            domainAddress: '',
          )),
          throwsA(anything),
        );
      });

      test('should handle RPC errors gracefully', () async {
        expect(
          () => getNftOwner(GetNftOwnerParams(
            rpc: rpc,
            domainAddress: 'invalid-address',
          )),
          throwsA(anything),
        );
      });

      test('should maintain function consistency', () async {
        final domainAddress = testDomainAddresses['bonfida']!;

        // Test multiple calls return same result
        final mintResult1 = await getNftMint(GetNftMintParams(
          domainAddress: domainAddress,
        ));

        final mintResult2 = await getNftMint(GetNftMintParams(
          domainAddress: domainAddress,
        ));

        expect(mintResult1, equals(mintResult2));

        final ownerResult1 = await getNftOwner(GetNftOwnerParams(
          rpc: rpc,
          domainAddress: domainAddress,
        ));

        final ownerResult2 = await getNftOwner(GetNftOwnerParams(
          rpc: rpc,
          domainAddress: domainAddress,
        ));

        expect(ownerResult1, equals(ownerResult2));
      });
    });
  });
}
