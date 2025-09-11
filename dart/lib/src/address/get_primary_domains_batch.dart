import 'dart:typed_data';
import 'package:solana/solana.dart' hide RpcClient;

import '../constants/addresses.dart';
import '../nft/get_nft_mint.dart';
import '../rpc/rpc_client.dart';
import '../states/primary_domain.dart';
import '../states/registry.dart';
import '../utils/deserialize_reverse.dart';
import '../utils/get_reverse_address_from_domain_address.dart';

/// Parameters for getting primary domains in batch
class GetPrimaryDomainsBatchParams {
  const GetPrimaryDomainsBatchParams({
    required this.rpc,
    required this.walletAddresses,
  });

  /// The RPC client for blockchain interaction
  final RpcClient rpc;

  /// List of wallet addresses for which primary domains are to be fetched
  final List<String> walletAddresses;
}

/// Internal class for tracking valid primary domains during batch processing
class _ValidPrimary {
  _ValidPrimary({
    required this.index,
    required this.domainAddress,
    this.registry,
  });

  /// Index in the original wallet addresses array
  final int index;

  /// The domain address
  final String domainAddress;

  /// Registry state (set after retrieval)
  RegistryState? registry;
}

/// Batch retrieves the primary domains associated with a list of wallet
/// addresses.
///
/// This function efficiently processes multiple wallet addresses to determine
/// their primary domains, handling NFT ownership, subdomain relationships,
/// and staleness detection.
///
/// Example:
/// ```dart
/// final primaryDomains = await getPrimaryDomainsBatch(
///   GetPrimaryDomainsBatchParams(
///   rpc: rpcClient,
///   walletAddresses: [wallet1, wallet2, wallet3],
///   )
/// );
///
/// for (int i = 0; i < primaryDomains.length; i++) {
///   final domain = primaryDomains[i];
///   if (domain != null) {
///     print('Wallet ${walletAddresses[i]} has primary domain: $domain');
///   }
/// }
/// ```
///
/// [params] - Parameters containing RPC client and list of wallet addresses
///
/// Returns a list of strings or null values, where each string represents
/// the primary domain name if available and non-stale
Future<List<String?>> getPrimaryDomainsBatch(
    GetPrimaryDomainsBatchParams params) async {
  final result = List<String?>.filled(params.walletAddresses.length, null);

  // Get primary domain addresses for all wallets
  final addresses = await Future.wait(
    params.walletAddresses.map(
      (address) => PrimaryDomainState.getAddress(nameOffersAddress, address),
    ),
  );

  // Retrieve primary domain states in batch
  final primaries =
      await PrimaryDomainState.retrieveBatch(params.rpc, addresses);

  // Filter out valid primaries
  var validPrimaries = <_ValidPrimary>[];
  for (var i = 0; i < primaries.length; i++) {
    final primary = primaries[i];
    if (primary != null) {
      validPrimaries.add(_ValidPrimary(
        index: i,
        domainAddress: primary.nameAccount,
      ));
    }
  }

  if (validPrimaries.isEmpty) {
    return result;
  }

  // Retrieve registry states for valid primaries
  final registries = await RegistryState.retrieveBatch(
    params.rpc,
    validPrimaries.map((item) => item.domainAddress).toList(),
  );

  // Associate registry states and filter out invalid ones
  validPrimaries = validPrimaries
      .asMap()
      .entries
      .where((entry) => registries[entry.key] != null)
      .map((entry) => _ValidPrimary(
            index: entry.value.index,
            domainAddress: entry.value.domainAddress,
            registry: registries[entry.key],
          ))
      .toList();

  if (validPrimaries.isEmpty) {
    return result;
  }

  // Prepare batch operations for reverse lookups and token accounts
  final revAddressesPromises = <Future<String>>[];
  final parentRevAddressesPromises = <Future<String>>[];
  final atasPromises = <Future<String?>>[];

  for (final validPrimary in validPrimaries) {
    final registry = validPrimary.registry!;
    final isSub = registry.parentName != rootDomainAddress;

    // Add parent reverse address lookup
    if (isSub) {
      parentRevAddressesPromises.add(
        getReverseAddressFromDomainAddress(registry.parentName),
      );
    } else {
      parentRevAddressesPromises.add(Future.value(defaultAddress));
    }

    // Add reverse address lookup
    revAddressesPromises.add(
      getReverseAddressFromDomainAddress(validPrimary.domainAddress),
    );

    // Add associated token account lookup
    atasPromises.add(_getAssociatedTokenAddress(
      validPrimary.domainAddress,
      params.walletAddresses[validPrimary.index],
    ));
  }

  // Execute all batch operations in parallel
  final revAddresses = await Future.wait(revAddressesPromises);
  final parentRevAddresses = await Future.wait(parentRevAddressesPromises);
  final ataAddresses = await Future.wait(atasPromises);

  // Fetch all account data in batches
  final revs = await params.rpc.fetchEncodedAccounts(revAddresses);
  final parentRevs = await params.rpc.fetchEncodedAccounts(parentRevAddresses);
  final tokenAccs = await params.rpc.fetchEncodedAccounts(
    ataAddresses.where((addr) => addr != null).cast<String>().toList(),
  );

  // Process results and build domain names
  var tokenAccIndex = 0;

  for (var i = 0; i < validPrimaries.length; i++) {
    final validPrimary = validPrimaries[i];
    final registry = validPrimary.registry!;
    final rev = revs[i];
    final parentRev = parentRevs[i];

    if (!rev.exists) {
      continue;
    }

    var parentRevName = '';

    // Process parent reverse lookup for subdomains
    if (parentRev.exists && parentRev.data.length > 96) {
      try {
        final parentName = deserializeReverse(
          Uint8List.fromList(parentRev.data.sublist(96)),
        );
        if (parentName != null) {
          parentRevName = '.$parentName';
        }
      } on Exception {
        // Continue processing if parent reverse lookup fails
      }
    }

    final walletAddress = params.walletAddresses[validPrimary.index];

    // Check if wallet directly owns the domain
    if (registry.owner == walletAddress) {
      try {
        final domainName = deserializeReverse(
          Uint8List.fromList(rev.data.sublist(96)),
          trimFirstNullByte: true,
        );
        if (domainName != null) {
          result[validPrimary.index] = domainName + parentRevName;
        }
      } on Exception {
        // Continue processing if domain name deserialization fails
      }
      continue;
    }

    // Check tokenized ownership
    final ataAddress = ataAddresses[i];
    if (ataAddress != null) {
      final tokenAcc = tokenAccs[tokenAccIndex++];

      if (tokenAcc.exists && tokenAcc.data.length >= 72) {
        try {
          // Token account structure: mint(32) + owner(32) + amount(8) + ...
          // Check if amount is 1 (bytes 64-72, little endian)
          final amountBytes = tokenAcc.data.sublist(64, 72);
          var amount = 0;
          for (var j = 0; j < 8; j++) {
            amount += amountBytes[j] << (j * 8);
          }

          if (amount == 1) {
            final domainName = deserializeReverse(
              Uint8List.fromList(rev.data.sublist(96)),
            );
            if (domainName != null) {
              result[validPrimary.index] = domainName + parentRevName;
            }
          }
        } on Exception {
          // Continue processing if token account parsing fails
        }
      }
    }

    // If we reach here, the primary domain is stale
  }

  return result;
}

/// Gets the associated token address for a domain NFT and wallet
///
/// [domainAddress] - The domain address
/// [walletAddress] - The wallet address
///
/// Returns the associated token address or null if NFT mint doesn't exist
Future<String?> _getAssociatedTokenAddress(
    String domainAddress, String walletAddress) async {
  try {
    final mint =
        await getNftMint(GetNftMintParams(domainAddress: domainAddress));

    // Use proper ATA PDA derivation matching Solana standards
    final result = await Ed25519HDPublicKey.findProgramAddress(
      seeds: [
        Ed25519HDPublicKey.fromBase58(walletAddress).bytes,
        Ed25519HDPublicKey.fromBase58(tokenProgramAddress).bytes,
        Ed25519HDPublicKey.fromBase58(mint).bytes,
      ],
      programId: Ed25519HDPublicKey.fromBase58(associatedTokenProgramAddress),
    );

    return result.toBase58();
  } on Exception {
    return null;
  }
}
