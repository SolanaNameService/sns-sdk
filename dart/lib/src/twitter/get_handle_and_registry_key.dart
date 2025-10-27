import 'package:solana/solana.dart' hide RpcClient;

import '../constants/addresses.dart';
import '../rpc/rpc_client.dart';
import '../utils/get_domain_key_sync.dart';
import 'reverse_twitter_registry_state.dart';

/// Get Twitter handle and registry key from a verified public key
///
/// This function mirrors js/src/twitter/getHandleAndRegistryKey.ts
///
/// [connection] - The RPC client for Solana blockchain communication
/// [verifiedPubkey] - The verified public key to look up
///
/// Returns a tuple of handle and registry key or throws if not found
Future<(String, Ed25519HDPublicKey)> getHandleAndRegistryKey(
  RpcClient connection,
  Ed25519HDPublicKey verifiedPubkey,
) async {
  // Hash the verified public key (same as JS implementation)
  final hashedVerifiedPubkey = getHashedNameSync(verifiedPubkey.toBase58());

  // Get the reverse registry key using the same derivation as JS
  final reverseRegistryKeyString = await getNameAccountKeySync(
    hashedVerifiedPubkey,
    nameClass: twitterVerificationAuthority,
    nameParent: twitterRootParentRegistryAddress,
  );

  final reverseRegistryKey =
      Ed25519HDPublicKey.fromBase58(reverseRegistryKeyString);

  // Retrieve the reverse registry state (same as JS implementation)
  final reverseRegistryState = await ReverseTwitterRegistryState.retrieve(
    connection,
    reverseRegistryKey,
  );

  return (
    reverseRegistryState.twitterHandle,
    reverseRegistryState.twitterRegistryKeyPubkey,
  );
}
