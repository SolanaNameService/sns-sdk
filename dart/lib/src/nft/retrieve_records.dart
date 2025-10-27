import 'dart:typed_data';

import 'package:solana/solana.dart' hide RpcClient;

import '../constants/addresses.dart';
import '../rpc/rpc_client.dart';
import 'get_record_from_mint.dart';
import 'nft_record.dart';

/// Raw token account representation
class RawTokenAccount {
  const RawTokenAccount({
    required this.mint,
    required this.owner,
    required this.amount,
  });
  final Ed25519HDPublicKey mint;
  final Ed25519HDPublicKey owner;
  final int amount;
}

/// Creates filter for token accounts owned by specific address
List<AccountFilter> _getFilter(String owner) => [
      MemcmpFilter(
        offset: 32, // Token account owner offset
        bytes: owner,
        encoding: 'base58',
      ),
      const MemcmpFilter(
        offset: 64, // Token account state (initialized = 1)
        bytes: '2',
        encoding: 'base58',
      ),
    ];

/// Internal closure to process token account and retrieve NFT record
Future<NftRecord?> _closure(
  RpcClient rpc,
  RawTokenAccount acc,
) async {
  final record = await getRecordFromMint(rpc, acc.mint);
  if (record.length == 1) {
    final data = Uint8List.fromList(record[0].account.data);
    return NftRecord.deserialize(data);
  }
  return null;
}

/// This function can be used to retrieve all the NFT records of an owner
///
/// This function mirrors js/src/nft/retrieveRecords.ts
///
/// [rpc] - The RPC client for Solana blockchain communication
/// [owner] - The owner of the NFT records
///
/// Returns a list of NftRecord objects for the owner
Future<List<NftRecord>> retrieveRecords(
  RpcClient rpc,
  Ed25519HDPublicKey owner,
) async {
  // Create filters for token program accounts
  final filters = <AccountFilter>[
    ..._getFilter(owner.toBase58()),
    const DataSizeFilter(size: 165), // SPL Token account size
  ];

  // Get token program accounts for the owner
  final result = await rpc.getProgramAccounts(
    tokenProgramAddress, // SPL Token program ID
    encoding: 'base64',
    filters: filters,
  );

  // Decode token account data
  final tokenAccs = <RawTokenAccount>[];
  for (final acc in result) {
    // Parse SPL token account layout
    // Layout: mint(32) + owner(32) + amount(8) + delegate_option(36) + state(1) + is_native_option(12) + delegated_amount(8) + close_authority_option(36)
    final data = acc.account.data;
    if (data.length >= 64) {
      final mintBytes = data.sublist(0, 32);
      final ownerBytes = data.sublist(32, 64);

      final mint = Ed25519HDPublicKey(mintBytes);
      final tokenOwner = Ed25519HDPublicKey(ownerBytes);

      // For simplicity, assume amount is 1 for NFTs
      const amount = 1;

      tokenAccs.add(RawTokenAccount(
        mint: mint,
        owner: tokenOwner,
        amount: amount,
      ));
    }
  }

  // Process each token account to find NFT records
  final promises = tokenAccs.map((acc) => _closure(rpc, acc));
  final records = await Future.wait(promises);

  // Filter out null values and return
  return records.where((e) => e != null).cast<NftRecord>().toList();
}
