import 'package:solana/solana.dart' hide RpcClient;

import '../constants/addresses.dart';
import '../rpc/rpc_client.dart';

/// This function can be used to retrieve a NFT Record given a mint
///
/// This function mirrors js/src/nft/getRecordFromMint.ts
///
/// [rpc] - The RPC client for Solana blockchain communication
/// [mint] - The mint of the NFT Record
///
/// Returns a list of ProgramAccount objects containing NFT records
Future<List<ProgramAccount>> getRecordFromMint(
  RpcClient rpc,
  Ed25519HDPublicKey mint,
) async {
  // NFT Record data size (from JS: NftRecord.LEN = 1 + 1 + 32 + 32 + 32 = 98)
  const nftRecordLen = 98;

  // Create filters matching the JavaScript implementation
  final filters = <AccountFilter>[
    const DataSizeFilter(size: nftRecordLen),
    const MemcmpFilter(
      offset: 0,
      bytes: '3', // Tag for ActiveRecord from JS enum (Tag.ActiveRecord = 2)
      encoding: 'base58',
    ),
    MemcmpFilter(
      offset: 1 + 1 + 32 + 32, // tag + nonce + nameAccount + owner = 66 bytes
      bytes: mint.toBase58(),
      encoding: 'base58',
    ),
  ];

  // Get program accounts using RPC client
  final result = await rpc.getProgramAccounts(
    nameTokenizerAddress,
    encoding: 'base64',
    filters: filters,
  );

  return result;
}
