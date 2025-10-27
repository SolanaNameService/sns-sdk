import 'package:solana/solana.dart' hide RpcClient;
import '../constants/addresses.dart';

/// Parameters for getting NFT mint
class GetNftMintParams {
  const GetNftMintParams({
    required this.domainAddress,
  });

  /// The domain address whose NFT mint is to be retrieved
  final String domainAddress;
}

/// Retrieves the mint address of a tokenized domain's NFT
///
/// [params] - Parameters containing the domain address
///
/// Returns the NFT mint address as a string
Future<String> getNftMint(GetNftMintParams params) async {
  final domainKey = Ed25519HDPublicKey.fromBase58(params.domainAddress);
  final mint = await getDomainMint(domainKey);
  return mint.toBase58();
}

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
