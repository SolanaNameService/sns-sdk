import 'package:solana/solana.dart' hide RpcClient;

import '../nft/retrieve_records.dart';
import '../rpc/rpc_client.dart';
import 'reverse_lookup_batch.dart';

/// Result of tokenized domain with metadata
class TokenizedDomain {
  const TokenizedDomain({
    required this.key,
    required this.mint,
    this.reverse,
  });

  /// The domain public key
  final Ed25519HDPublicKey key;

  /// The NFT mint address
  final Ed25519HDPublicKey mint;

  /// The human-readable domain name
  final String? reverse;
}

/// Gets all the tokenized domains of an owner
///
/// This function mirrors js/src/utils/getTokenizedDomains.ts
///
/// [rpc] - The RPC client for Solana blockchain communication
/// [owner] - The owner of the tokenized domains
///
/// Returns a list of TokenizedDomain objects with key, mint, and reverse name
Future<List<TokenizedDomain>> getTokenizedDomains(
  RpcClient rpc,
  Ed25519HDPublicKey owner,
) async {
  // Get all NFT records for the owner
  final nftRecords = await retrieveRecords(rpc, owner);

  // Get reverse lookup names for all domain keys
  final domainKeyStrings =
      nftRecords.map((e) => e.nameAccount.toBase58()).toList();
  final names = await reverseLookupBatch(ReverseLookupBatchParams(
    rpc: rpc,
    domainAddresses: domainKeyStrings,
  ));

  // Combine NFT records with reverse lookup results
  final result = <TokenizedDomain>[];
  for (var i = 0; i < nftRecords.length; i++) {
    final record = nftRecords[i];
    final reverseName = i < names.length ? names[i] : null;

    // Only include domains that have valid reverse lookup
    if (reverseName != null) {
      result.add(TokenizedDomain(
        key: record.nameAccount,
        mint: record.nftMint,
        reverse: reverseName,
      ));
    }
  }

  return result;
}
