import '../rpc/rpc_client.dart';
import '../states/registry.dart';
import 'deserialize_reverse.dart';
import 'get_reverse_address_from_domain_address.dart';

/// Parameters for reverse lookup operation
class ReverseLookupParams {
  const ReverseLookupParams({
    required this.rpc,
    required this.domainAddress,
    this.parentAddress,
  });

  /// The RPC client to interact with the blockchain
  final RpcClient rpc;

  /// The domain address to perform the reverse lookup on
  final String domainAddress;

  /// The parent domain address, if applicable
  final String? parentAddress;
}

/// Perform a reverse lookup for a given domain address.
///
/// This function takes a domain address and retrieves the human-readable
/// domain name associated with it by reading the reverse registry entry.
///
/// Example:
/// ```dart
/// final domainName = await reverseLookup(ReverseLookupParams(
///   rpc: rpcClient,
///   domainAddress: domainAddr,
///   parentAddress: parentAddr, // optional for subdomains
/// ));
/// print('Domain name: $domainName');
/// ```
///
/// [params] - Parameters containing RPC client, domain address, and optional parent address
///
/// Returns the human-readable domain name associated with the given address
///
/// Throws [StateError] if the registry data is empty
Future<String?> reverseLookup(ReverseLookupParams params) async {
  try {
    final reverseAddress = await getReverseAddressFromDomainAddress(
      params.domainAddress,
    );

    final registry = await RegistryState.retrieve(params.rpc, reverseAddress);

    if (registry.data == null || registry.data!.isEmpty) {
      throw StateError('The registry data is empty');
    }

    return deserializeReverse(
      registry.data!,
      trimFirstNullByte: params.parentAddress != null,
    );
  } on Exception {
    // Return null if reverse lookup fails instead of throwing
    return null;
  }
}
