import '../constants/addresses.dart';
import '../nft/get_nft_owner.dart';
import '../rpc/rpc_client.dart';
import '../states/primary_domain.dart';
import '../states/registry.dart';
import '../utils/reverse_lookup.dart';

/// Parameters for retrieving primary domain for a wallet address.
class GetPrimaryDomainParams {
  /// Creates primary domain parameters.
  const GetPrimaryDomainParams({
    required this.rpc,
    required this.walletAddress,
  });

  /// RPC client for blockchain operations.
  final RpcClient rpc;

  /// Wallet address to get primary domain for.
  final String walletAddress;
}

/// Result containing primary domain information and validation status.
class PrimaryDomainResult {
  /// Creates primary domain result.
  const PrimaryDomainResult({
    required this.domainAddress,
    required this.domainName,
    required this.stale,
  });

  /// Domain address of the primary domain.
  final String domainAddress;

  /// Primary domain name (without .sol suffix).
  final String domainName;

  /// Whether primary domain setting is stale.
  ///
  /// Returns `false` if primary domain was set by current domain owner,
  /// `true` if domain ownership changed since setting.
  final bool stale;
}

/// Retrieves the primary (favorite) domain associated with a wallet address.
///
/// Primary domains allow users to designate a preferred domain for reverse
/// resolution lookups. When multiple domains are owned by the same wallet,
/// the primary domain provides the canonical address-to-name mapping.
///
/// Returns comprehensive domain information including staleness validation
/// to ensure the primary domain setting is still valid (domain ownership
/// hasn't changed since designation).
///
/// Example:
/// ```dart
/// final result = await getPrimaryDomain(GetPrimaryDomainParams(
///   rpc: rpc,
///   walletAddress: 'wallet_address_here',
/// ));
///
/// if (result != null) {
///   print('Primary domain: ${result.domainName}');
///   print('Is stale: ${result.stale}');
/// } else {
///   print('No primary domain set');
/// }
/// ```
///
/// [params] Wallet address and RPC client configuration.
///
/// Returns [PrimaryDomainResult] with domain information, or `null` if no
/// primary domain is set for the address.
///
/// Returns `null` if primary domain doesn't exist or on retrieval error.
Future<PrimaryDomainResult?> getPrimaryDomain(
    GetPrimaryDomainParams params) async {
  try {
    // Get the primary domain address for this wallet
    final primaryAddress = await PrimaryDomainState.getAddress(
      nameOffersAddress,
      params.walletAddress,
    );

    // Retrieve the primary domain state
    final primary =
        await PrimaryDomainState.retrieve(params.rpc, primaryAddress);

    // Get registry state and NFT owner in parallel
    final results = await Future.wait([
      RegistryState.retrieve(params.rpc, primary.nameAccount),
      getNftOwner(GetNftOwnerParams(
        rpc: params.rpc,
        domainAddress: primary.nameAccount,
      )),
    ]);

    final registry = results[0] as RegistryState;
    final nftOwner = results[1] as String?;

    // Determine the actual domain owner (NFT owner takes precedence)
    final domainOwner = nftOwner ?? registry.owner;

    // Check if this is a subdomain
    final isSub = registry.parentName != rootDomainAddress;

    // Prepare reverse lookup operations
    // Create lookups list with primary domain lookup
    final lookups = <Future<String?>>[
      reverseLookup(ReverseLookupParams(
        rpc: params.rpc,
        domainAddress: primary.nameAccount,
        parentAddress: isSub ? registry.parentName : null,
      ))
    ];

    // If it's a subdomain, also lookup the parent domain
    if (isSub) {
      lookups.add(reverseLookup(ReverseLookupParams(
        rpc: params.rpc,
        domainAddress: registry.parentName,
      )));
    }

    // Execute reverse lookups
    final lookupResults = await Future.wait(lookups);

    // Construct the full domain name
    final domainName = lookupResults.where((name) => name != null).join('.');

    return PrimaryDomainResult(
      domainAddress: primary.nameAccount,
      domainName: domainName,
      stale: params.walletAddress != domainOwner,
    );
  } on Exception {
    // Return null if primary domain doesn't exist or there's an error
    return null;
  }
}
