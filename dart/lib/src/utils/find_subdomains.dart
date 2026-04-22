import 'dart:typed_data';

import 'package:solana/solana.dart' hide RpcClient;

import '../constants/addresses.dart';
import '../rpc/rpc_client.dart';
import 'deserialize_reverse.dart';
import 'get_reverse_key_sync.dart';

/// Finds all subdomains for a given parent domain
///
/// This function mirrors js/src/utils/findSubdomains.ts
///
/// [rpc] - The RPC client for Solana blockchain communication
/// [parentKey] - The parent domain public key to find sub-domains for
///
/// Returns a list of subdomain names
Future<List<String>> findSubdomains(
  RpcClient rpc,
  Ed25519HDPublicKey parentKey,
) async {
  // Fetch reverse accounts
  final filtersRevs = [
    MemcmpFilter(
      offset: 0,
      bytes: parentKey.toBase58(),
      encoding: 'base58',
    ),
    const MemcmpFilter(
      offset: 64,
      bytes: reverseLookupClass,
      encoding: 'base58',
    ),
  ];

  final reverses = await rpc.getProgramAccounts(
    nameProgramAddress,
    encoding: 'base64',
    filters: filtersRevs,
  );

  // Fetch subdomain accounts
  final filtersSubs = [
    MemcmpFilter(
      offset: 0,
      bytes: parentKey.toBase58(),
      encoding: 'base58',
    ),
  ];

  final subs = await rpc.getProgramAccounts(
    nameProgramAddress,
    encoding: 'base64',
    filters: filtersSubs,
    dataSlice: const DataSlice(offset: 0, length: 0),
  );

  // Create a map of reverse lookups
  final reverseMap = <String, String?>{};
  for (final reverse in reverses) {
    if (reverse.account.data.length >= 96) {
      final data = Uint8List.fromList(reverse.account.data.sublist(96));
      final reverseName = deserializeReverse(
        data,
        trimFirstNullByte: true,
      );
      reverseMap[reverse.pubkey] = reverseName;
    }
  }

  // Process subdomains
  final result = <String>[];
  for (final sub in subs) {
    try {
      final reverseKey = await getReverseKeyFromDomainKeySync(
        Ed25519HDPublicKey.fromBase58(sub.pubkey),
        parentKey,
      );
      final reverseName = reverseMap[reverseKey.toBase58()];
      if (reverseName != null && reverseName.isNotEmpty) {
        result.add(reverseName);
      }
    } on Exception {
      // Skip invalid subdomains
      continue;
    }
  }

  return result;
}
