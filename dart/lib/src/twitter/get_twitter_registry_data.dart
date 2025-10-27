import 'dart:typed_data';

import 'package:solana/solana.dart' hide RpcClient;

import '../constants/addresses.dart';
import '../rpc/rpc_client.dart';
import 'reverse_twitter_registry_state.dart';

/// Get Twitter registry data using filters (alternative to getTwitterRegistry)
///
/// This function mirrors js/src/twitter/getTwitterRegistryData.ts
/// Uses the RPC node filtering feature, execution speed may vary
/// Does not give you the handle, but is an alternative to
/// getHandleAndRegistryKeyViaFilters + getTwitterRegistry to get the data
///
/// [connection] - The RPC client for Solana blockchain communication
/// [verifiedPubkey] - The verified public key to look up
///
/// Returns the raw registry data
Future<Uint8List> getTwitterRegistryData(
  RpcClient connection,
  Ed25519HDPublicKey verifiedPubkey,
) async {
  final filters = <AccountFilter>[
    // Filter by parent registry
    const MemcmpFilter(
      offset: 0,
      bytes: twitterRootParentRegistryAddress,
      encoding: 'base58',
    ),
    // Filter by verified pubkey at offset 32
    MemcmpFilter(
      offset: 32,
      bytes: verifiedPubkey.toBase58(),
      encoding: 'base58',
    ),
    // Filter by zero bytes at offset 64 (empty class field)
    MemcmpFilter(
      offset: 64,
      bytes: Ed25519HDPublicKey(Uint8List(32)).toBase58(), // 32 zero bytes
      encoding: 'base58',
    ),
  ];

  final filteredAccounts = await connection.getProgramAccounts(
    nameProgramAddress,
    encoding: 'base64',
    filters: filters,
  );

  if (filteredAccounts.isEmpty) {
    throw Exception('No Twitter registry found for the verified pubkey');
  }

  if (filteredAccounts.length > 1) {
    throw Exception('More than 1 accounts were found');
  }

  // Return data slice after the header
  final accountData = filteredAccounts[0].account.data;
  return Uint8List.fromList(accountData.skip(nameRegistryHeaderLen).toList());
}
