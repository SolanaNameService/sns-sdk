import 'package:solana/solana.dart' hide RpcClient;
import 'get_reverse_key_sync.dart';

/// Derives the reverse address from a domain address.
///
/// This function mirrors js-kit/src/utils/getReverseAddressFromDomainAddress.ts
///
/// [domainAddress] - The domain address to get the reverse address from
///
/// Returns the reverse address as a base58 string
Future<String> getReverseAddressFromDomainAddress(String domainAddress) async {
  final domainKey = Ed25519HDPublicKey.fromBase58(domainAddress);
  final reverseKey = await getReverseKeyFromDomainKeySync(domainKey);
  return reverseKey.toBase58();
}
