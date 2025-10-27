import 'package:solana/solana.dart' hide RpcClient;
import '../rpc/rpc_client.dart';
import 'get_all_domains.dart';
import 'reverse_lookup_batch.dart';

/// Result of getting domain keys with reverse lookup
class DomainKeyWithReverse {
  const DomainKeyWithReverse({
    required this.pubKey,
    this.domain,
  });

  /// The domain public key
  final Ed25519HDPublicKey pubKey;

  /// The human-readable domain name
  final String? domain;
}

/// Gets all domain names owned by a wallet in human readable format
///
/// This function mirrors js/src/utils/getDomainKeysWithReverses.ts
///
/// [rpc] - The RPC client for Solana blockchain communication
/// [wallet] - The wallet you want to search domain names for
///
/// Returns an array of DomainKeyWithReverse objects containing pubkeys and the corresponding human readable domain names
Future<List<DomainKeyWithReverse>> getDomainKeysWithReverses(
  RpcClient rpc,
  Ed25519HDPublicKey wallet,
) async {
  final encodedNameArr = await getAllDomains(rpc, wallet);
  final names = await reverseLookupBatch(
    ReverseLookupBatchParams(
      rpc: rpc,
      domainAddresses: encodedNameArr.map((key) => key.toBase58()).toList(),
    ),
  );

  return List.generate(
    encodedNameArr.length,
    (index) => DomainKeyWithReverse(
      pubKey: encodedNameArr[index],
      domain: names[index],
    ),
  );
}
