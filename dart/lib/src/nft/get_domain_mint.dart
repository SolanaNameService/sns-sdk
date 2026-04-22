import 'package:solana/solana.dart' hide RpcClient;
import '../constants/addresses.dart';

/// Gets the mint address of a tokenized domain's NFT
///
/// This function mirrors js/src/nft/getDomainMint.ts
///
/// [domain] - The domain public key
///
/// Returns the NFT mint public key
Future<Ed25519HDPublicKey> getDomainMint(Ed25519HDPublicKey domain) async {
  const mintPrefix = 'tokenized_name';

  final seeds = [
    mintPrefix.codeUnits,
    domain.bytes,
  ];

  final programId = Ed25519HDPublicKey.fromBase58(nameTokenizerAddress);

  final result = await Ed25519HDPublicKey.findProgramAddress(
    seeds: seeds,
    programId: programId,
  );

  return result;
}
