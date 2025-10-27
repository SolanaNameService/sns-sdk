import '../domain/get_domain_address.dart';
import '../nft/get_nft_owner.dart';
import '../rpc/rpc_client.dart';
import '../states/registry.dart';

/// Parameters for getting domain owner
class GetDomainOwnerParams {
  const GetDomainOwnerParams({
    required this.rpc,
    required this.domain,
  });

  /// The RPC client for blockchain interaction
  final RpcClient rpc;

  /// The domain name to get the owner for
  final String domain;
}

/// Retrieves the owner of the specified domain.
///
/// If the domain is tokenized, the NFT's owner is returned;
/// otherwise, the registry owner is returned.
///
/// This matches js-kit/src/domain/getDomainOwner.ts
///
/// [params] - Parameters containing RPC client and domain name
///
/// Returns the owner address of the domain
Future<String> getDomainOwner(GetDomainOwnerParams params) async {
  final domainResult = await getDomainAddress(GetDomainAddressParams(
    domain: params.domain,
  ));

  final results = await Future.wait([
    RegistryState.retrieve(params.rpc, domainResult.domainAddress),
    getNftOwner(GetNftOwnerParams(
      rpc: params.rpc,
      domainAddress: domainResult.domainAddress,
    )),
  ]);

  final registry = results[0] as RegistryState;
  final nftOwner = results[1] as String?;

  return nftOwner ?? registry.owner;
}
