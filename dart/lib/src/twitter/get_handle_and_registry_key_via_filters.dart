import 'dart:typed_data';

import 'package:solana/solana.dart' hide RpcClient;

import '../constants/addresses.dart';
import '../rpc/rpc_client.dart';
import 'reverse_twitter_registry_state.dart';

/// Get Twitter handle and registry key via RPC filters
///
/// This function mirrors js/src/twitter/getTwitterHandleandRegistryKeyViaFilters.ts
///
/// [connection] - The RPC client for Solana blockchain communication
/// [verifiedPubkey] - The verified public key to look up
///
/// Returns a tuple of handle and registry key or throws if not found
Future<(String, Ed25519HDPublicKey)> getHandleAndRegistryKeyViaFilters(
  RpcClient connection,
  Ed25519HDPublicKey verifiedPubkey,
) async {
  final filters = <AccountFilter>[
    // Filter by parent registry
    const MemcmpFilter(
      offset: 0, // Root parent at beginning
      bytes: twitterRootParentRegistryAddress,
      encoding: 'base58',
    ),
    // Filter by verified pubkey at offset 32
    MemcmpFilter(
      offset: 32,
      bytes: verifiedPubkey.toBase58(),
      encoding: 'base58',
    ),
    // Filter by verification authority at offset 64
    const MemcmpFilter(
      offset: 64,
      bytes: twitterVerificationAuthority,
      encoding: 'base58',
    ),
  ];

  final filteredAccounts = await connection.getProgramAccounts(
    nameProgramAddress,
    encoding: 'base64',
    filters: filters,
  );

  if (filteredAccounts.isEmpty) {
    throw Exception('The twitter account does not exist');
  }

  // Process each filtered account to find one with sufficient data
  for (final account in filteredAccounts) {
    final data = account.account.data;
    if (data.length > nameRegistryHeaderLen + 32) {
      final accountData =
          Uint8List.fromList(data.skip(nameRegistryHeaderLen).toList());
      final state = ReverseTwitterRegistryState.deserialize(accountData);

      return (state.twitterHandle, state.twitterRegistryKeyPubkey);
    }
  }

  throw Exception('The twitter account does not exist');
}
