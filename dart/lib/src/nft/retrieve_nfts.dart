import 'package:solana/solana.dart' hide RpcClient;

import '../constants/addresses.dart';
import '../rpc/rpc_client.dart';

/// This function can be used to retrieve all the tokenized domains name
///
/// This function mirrors js/src/nft/retrieveNfts.ts
///
/// [rpc] - The RPC client for Solana blockchain communication
///
/// Returns a list of tokenized domain mint addresses
Future<List<Ed25519HDPublicKey>> retrieveNfts(RpcClient rpc) async {
  // NFT Record data size (from JS: NftRecord.LEN = 1 + 1 + 32 + 32 + 32 = 98)
  const nftRecordLen = 98;

  // Create filters to find all active NFT records
  final filters = <AccountFilter>[
    const DataSizeFilter(size: nftRecordLen),
    const MemcmpFilter(
      offset: 0,
      bytes: '3', // Tag for ActiveRecord from JS enum (Tag.ActiveRecord = 2)
      encoding: 'base58',
    ),
  ];

  // Get all NFT record accounts
  final result = await rpc.getProgramAccounts(
    nameTokenizerAddress,
    encoding: 'base64',
    filters: filters,
  );

  // Extract mint addresses from NFT records
  // Offset: tag(1) + nonce(1) + nameAccount(32) + owner(32) = 66 bytes
  const offset = 1 + 1 + 32 + 32;
  final mints = <Ed25519HDPublicKey>[];

  for (final account in result) {
    final data = account.account.data;
    if (data.length >= offset + 32) {
      final mintBytes = data.sublist(offset, offset + 32);
      final mint = Ed25519HDPublicKey(mintBytes);
      mints.add(mint);
    }
  }

  return mints;
}
