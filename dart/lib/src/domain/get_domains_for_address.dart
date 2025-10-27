import '../constants/addresses.dart';
import '../rpc/rpc_client.dart';
import '../utils/reverse_lookup_batch.dart';

/// Result containing domain and domain address
class DomainResult {
  const DomainResult({
    required this.domain,
    required this.domainAddress,
  });

  /// The human-readable domain name
  final String domain;

  /// The domain address
  final String domainAddress;
}

/// Parameters for getting domains for an address
class GetDomainsForAddressParams {
  const GetDomainsForAddressParams({
    required this.rpc,
    required this.address,
  });

  /// The RPC client for blockchain interaction
  final RpcClient rpc;

  /// The address for which to retrieve associated domains
  final String address;
}

/// Retrieves the domains owned by the given address.
///
/// This function mirrors js-kit/src/address/getDomainsForAddress.ts
///
/// [params] - Parameters containing RPC client and owner address
///
/// Returns a promise resolving to an array of objects containing domain and domainAddress.
Future<List<DomainResult>> getDomainsForAddress(
    GetDomainsForAddressParams params) async {
  final results = await params.rpc.getProgramAccounts(
    nameProgramAddress,
    encoding: 'base64',
    filters: [
      MemcmpFilter(
        offset: 32,
        bytes: params.address,
        encoding: 'base58',
      ),
      const MemcmpFilter(
        offset: 0,
        bytes: rootDomainAddress,
        encoding: 'base58',
      ),
    ],
    dataSlice: const DataSlice(
      offset: 0,
      length: 0,
    ),
  );

  final domains = await reverseLookupBatch(ReverseLookupBatchParams(
    rpc: params.rpc,
    domainAddresses: results.map((r) => r.pubkey).toList(),
  ));

  final validResults = <DomainResult>[];

  for (var i = 0; i < domains.length; i++) {
    final domain = domains[i];
    if (domain != null) {
      validResults.add(DomainResult(
        domain: domain,
        domainAddress: results[i].pubkey,
      ));
    }
  }

  return validResults;
}
