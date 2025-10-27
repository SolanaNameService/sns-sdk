import 'package:solana/solana.dart' hide RpcClient;
import '../constants/addresses.dart';
import 'get_domain_key_sync.dart';

/// Gets the key of the reverse account synchronously
///
/// This function mirrors js/src/utils/getReverseKeySync.ts
///
/// [domain] - The domain to compute the reverse for
/// [isSub] - Whether the domain is a subdomain or not
///
/// Returns the public key of the reverse account
Future<Ed25519HDPublicKey> getReverseKeySync(String domain,
    {bool isSub = false}) async {
  final domainResult = await getDomainKeySync(domain);
  final hashedReverseLookup = getHashedNameSync(domainResult.pubkey);

  final reverseKey = await getNameAccountKeySync(
    hashedReverseLookup,
    nameClass: reverseLookupClass,
    nameParent: isSub ? domainResult.parent : null,
  );

  return Ed25519HDPublicKey.fromBase58(reverseKey);
}

/// Gets the reverse key from a domain key synchronously
///
/// [domainKey] - The domain key to compute the reverse for
/// [parent] - The parent public key (optional)
///
/// Returns the public key of the reverse account
Future<Ed25519HDPublicKey> getReverseKeyFromDomainKeySync(
  Ed25519HDPublicKey domainKey, [
  Ed25519HDPublicKey? parent,
]) async {
  final hashedReverseLookup = getHashedNameSync(domainKey.toBase58());
  final keyString = await getNameAccountKeySync(
    hashedReverseLookup,
    nameClass: reverseLookupClass,
    nameParent: parent?.toBase58(),
  );
  return Ed25519HDPublicKey.fromBase58(keyString);
}
