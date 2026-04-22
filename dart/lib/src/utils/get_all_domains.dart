import 'package:solana/solana.dart' hide RpcClient;
import '../constants/addresses.dart';
import '../rpc/rpc_client.dart';

/// Gets all domains owned by a specific wallet
///
/// This function mirrors js/src/utils/getAllDomains.ts
///
/// [rpc] - The RPC client for Solana blockchain communication
/// [wallet] - The wallet address to search domain names for
///
/// Returns a list of domain public keys owned by the wallet
Future<List<Ed25519HDPublicKey>> getAllDomains(
  RpcClient rpc,
  Ed25519HDPublicKey wallet,
) async {
  final filters = [
    MemcmpFilter(
      offset: 32,
      bytes: wallet.toBase58(),
      encoding: 'base58',
    ),
    const MemcmpFilter(
      offset: 0,
      bytes: rootDomainAddress,
      encoding: 'base58',
    ),
  ];

  final accounts = await rpc.getProgramAccounts(
    nameProgramAddress,
    encoding: 'base64',
    filters: filters,
    // Only the public keys matter, not the data
    dataSlice: const DataSlice(offset: 0, length: 0),
  );

  return accounts
      .map((account) => Ed25519HDPublicKey.fromBase58(account.pubkey))
      .toList();
}
