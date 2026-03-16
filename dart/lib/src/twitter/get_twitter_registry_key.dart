import 'package:solana/solana.dart' hide RpcClient;
import '../constants/addresses.dart';
import '../utils/get_domain_key_sync.dart';

/// Get Twitter registry key for a Twitter handle
///
/// This function mirrors js/src/twitter/getTwitterRegistryKey.ts
///
/// [twitterHandle] - The Twitter handle (without @)
///
/// Returns the public key for the Twitter registry
Future<Ed25519HDPublicKey> getTwitterRegistryKey(String twitterHandle) async {
  final hashedTwitterHandle = getHashedNameSync(twitterHandle);

  final keyString = await getNameAccountKeySync(
    hashedTwitterHandle,
    nameParent: twitterRootParentRegistryAddress,
  );

  return Ed25519HDPublicKey.fromBase58(keyString);
}
