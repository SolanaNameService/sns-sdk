import '../rpc/rpc_client.dart';
import 'get_twitter_registry_key.dart';

/// Get Twitter registry state for a Twitter handle
///
/// This function mirrors js/src/twitter/getTwitterRegistry.ts
///
/// [connection] - The RPC client for Solana blockchain communication
/// [twitterHandle] - The Twitter handle (without @)
///
/// Returns the registry account info
Future<AccountInfo> getTwitterRegistry(
  RpcClient connection,
  String twitterHandle,
) async {
  final twitterHandleRegistryKey = await getTwitterRegistryKey(twitterHandle);

  final accountInfo = await connection.fetchEncodedAccount(
    twitterHandleRegistryKey.toBase58(),
  );

  if (!accountInfo.exists) {
    throw Exception(
        'Twitter registry does not exist for handle: $twitterHandle');
  }

  return accountInfo;
}
