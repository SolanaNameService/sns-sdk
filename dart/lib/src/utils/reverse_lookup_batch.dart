import '../rpc/rpc_client.dart';
import '../states/registry.dart';
import 'deserialize_reverse.dart';
import 'get_reverse_address_from_domain_address.dart';

/// Parameters for performing batch reverse lookup
class ReverseLookupBatchParams {
  const ReverseLookupBatchParams({
    required this.rpc,
    required this.domainAddresses,
  });

  /// The RPC client to interact with the blockchain
  final RpcClient rpc;

  /// The domain addresses to perform the reverse lookup on
  final List<String> domainAddresses;
}

/// Perform a batch reverse lookup for given domain addresses.
///
/// This function mirrors js-kit/src/utils/reverseLookupBatch.ts
///
/// [params] - Parameters containing RPC client and domain addresses
///
/// Returns a promise that resolves to a list of human-readable domain names
/// associated with the given addresses, or null if the data is not available.
Future<List<String?>> reverseLookupBatch(
    ReverseLookupBatchParams params) async {
  final reverseLookupAddresses = await Future.wait(
    params.domainAddresses.map(getReverseAddressFromDomainAddress),
  );

  final states =
      await RegistryState.retrieveBatch(params.rpc, reverseLookupAddresses);

  return states
      .map((state) =>
          state?.data != null ? deserializeReverse(state!.data) : null)
      .toList();
}
