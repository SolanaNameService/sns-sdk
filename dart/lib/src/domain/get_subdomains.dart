import 'dart:typed_data';

import '../constants/addresses.dart';
import '../domain/get_domain_address.dart';
import '../rpc/rpc_client.dart';
import '../utils/deserialize_reverse.dart';
import '../utils/get_reverse_address_from_domain_address.dart';

/// Result containing subdomain and owner information
class SubdomainResult {
  const SubdomainResult({
    required this.subdomain,
    required this.owner,
  });

  /// The subdomain name
  final String subdomain;

  /// The owner address
  final String owner;
}

/// Parameters for getting subdomains
class GetSubdomainsParams {
  const GetSubdomainsParams({
    required this.rpc,
    required this.domain,
  });

  /// The RPC client for blockchain interaction
  final RpcClient rpc;

  /// The domain whose subdomains are to be retrieved
  final String domain;
}

/// Retrieves all subdomains under the specified domain, including their owners.
///
/// This function mirrors js-kit/src/domain/getSubdomains.ts
///
/// [params] - Parameters containing RPC client and parent domain
///
/// Returns a promise that resolves to an array of subdomain objects, each containing the subdomain name and owner address.
Future<List<SubdomainResult>> getSubdomains(GetSubdomainsParams params) async {
  final domainAddressResult = await getDomainAddress(GetDomainAddressParams(
    domain: params.domain,
  ));

  // If the domain is already a subdomain, return empty list
  if (domainAddressResult.isSub) return [];

  final domainAddress = domainAddressResult.domainAddress;

  // Get reverse lookup accounts
  final reversesAsync = params.rpc.getProgramAccounts(
    nameProgramAddress,
    encoding: 'base64',
    filters: [
      MemcmpFilter(
        offset: 0,
        bytes: domainAddress,
        encoding: 'base58',
      ),
      const MemcmpFilter(
        offset: 64,
        bytes: reverseLookupClass,
        encoding: 'base58',
      ),
    ],
  );

  // Get subdomain accounts
  final subsAsync = params.rpc.getProgramAccounts(
    nameProgramAddress,
    encoding: 'base64',
    filters: [
      MemcmpFilter(
        offset: 0,
        bytes: domainAddress,
        encoding: 'base58',
      ),
    ],
    dataSlice: const DataSlice(
      offset: 32,
      length: 32,
    ),
  );

  final results = await Future.wait([reversesAsync, subsAsync]);
  final reverses = results[0];
  final subs = results[1];

  // Create map of reverse addresses to subdomain names
  final reverseMap = <String, String?>{};

  for (final reverse in reverses) {
    final data = reverse.account.data;
    if (data.length >= 96) {
      final reverseData = Uint8List.fromList(data.sublist(96));
      final subdomainName = deserializeReverse(
        reverseData,
        trimFirstNullByte: true,
      );
      reverseMap[reverse.pubkey] = subdomainName;
    }
  }

  // Process subdomains
  final subdomainResults = <SubdomainResult>[];

  for (final sub in subs) {
    try {
      final reverseAddress =
          await getReverseAddressFromDomainAddress(sub.pubkey);
      final subdomainName = reverseMap[reverseAddress];

      if (subdomainName != null) {
        // Extract owner from account data (first 32 bytes)
        final ownerBytes = sub.account.data.take(32).toList();
        final ownerAddress = _base58Encode(ownerBytes);

        subdomainResults.add(SubdomainResult(
          subdomain: subdomainName,
          owner: ownerAddress,
        ));
      }
    } on Exception {
      // Skip invalid subdomains
      continue;
    }
  }

  return subdomainResults;
}

/// Base58 encode helper
String _base58Encode(List<int> input) {
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

  if (input.isEmpty) return '';

  // Count leading zeros
  var leadingZeros = 0;
  for (var i = 0; i < input.length; i++) {
    if (input[i] == 0) {
      leadingZeros++;
    } else {
      break;
    }
  }

  // Convert to BigInt
  var value = BigInt.zero;
  for (var i = 0; i < input.length; i++) {
    value = value * BigInt.from(256) + BigInt.from(input[i]);
  }

  // Encode to base58
  final result = <String>[];
  final base = BigInt.from(58);

  while (value > BigInt.zero) {
    final remainder = (value % base).toInt();
    result.insert(0, alphabet[remainder]);
    value = value ~/ base;
  }

  // Add leading ones for leading zeros
  for (var i = 0; i < leadingZeros; i++) {
    result.insert(0, '1');
  }

  return result.join();
}
