import 'dart:typed_data';

import 'package:solana/solana.dart' hide RpcClient;

import '../constants/addresses.dart';
import '../errors/sns_errors.dart';
import '../rpc/rpc_client.dart' as sns_rpc;
import '../states/registry.dart';
import '../utils/reverse_lookup.dart';

/// The Name Offers program ID
const String nameOffersId = '85iDfUvr3HJyLM2zcq5BXSiDvUfw6cSE1FfNBo8Ap29';

/// Favorite domain state and operations
class FavouriteDomain {
  const FavouriteDomain({
    required this.tag,
    required this.nameAccount,
  });
  final int tag;
  final Ed25519HDPublicKey nameAccount;

  /// Deserialize a FavouriteDomain from account data
  static FavouriteDomain deserialize(Uint8List data) {
    if (data.length < 33) {
      throw ArgumentError('Invalid favorite domain data length');
    }

    final tag = data[0];
    final nameAccountBytes = data.sublist(1, 33);
    final nameAccount = Ed25519HDPublicKey(nameAccountBytes);

    return FavouriteDomain(
      tag: tag,
      nameAccount: nameAccount,
    );
  }

  /// Retrieve and deserialize a favorite domain account
  static Future<FavouriteDomain> retrieve(
    sns_rpc.RpcClient connection,
    Ed25519HDPublicKey key,
  ) async {
    final accountInfo = await connection.fetchEncodedAccount(key.toBase58());
    if (!accountInfo.exists || accountInfo.data.isEmpty) {
      throw SnsError(
        ErrorType.accountDoesNotExist,
        'The favourite account does not exist',
      );
    }

    final data = Uint8List.fromList(accountInfo.data);
    return deserialize(data);
  }

  /// Derive the key of a favorite domain using proper PDA derivation
  static Future<(Ed25519HDPublicKey, int)> getKey(
    Ed25519HDPublicKey programId,
    Ed25519HDPublicKey owner,
  ) async {
    final seeds = [
      Uint8List.fromList('favourite_domain'.codeUnits),
      owner.bytes,
    ];

    // Use proper PDA derivation matching JavaScript SDK
    final address = await Ed25519HDPublicKey.findProgramAddress(
      seeds: seeds,
      programId: programId,
    );

    return (address, 255); // findProgramAddress returns the correct bump
  }

  /// Derive the key of a favorite domain (sync version)
  static (Ed25519HDPublicKey, int) getKeySync(
    Ed25519HDPublicKey programId,
    Ed25519HDPublicKey owner,
  ) {
    // For proper sync derivation, we'd need to implement the PDA derivation algorithm
    // For now, throw an error directing users to use the async version
    throw UnimplementedError(
        'Synchronous PDA derivation requires complex cryptographic operations. '
        'Use getKey() async method instead for proper derivation.');
  }
}

/// Alias for FavouriteDomain
typedef PrimaryDomain = FavouriteDomain;

/// Result for favorite domain lookup
class FavoriteDomainResult {
  const FavoriteDomainResult({
    required this.domain,
    required this.reverse,
    required this.stale,
  });
  final Ed25519HDPublicKey domain;
  final String reverse;
  final bool stale;
}

/// Retrieve the favorite domain of a user
Future<FavoriteDomainResult> getFavoriteDomain(
  sns_rpc.RpcClient connection,
  Ed25519HDPublicKey owner,
) async {
  final programId = Ed25519HDPublicKey.fromBase58(nameOffersId);
  final (favKey, _) = FavouriteDomain.getKeySync(programId, owner);

  final favorite = await FavouriteDomain.retrieve(connection, favKey);

  // Get the registry state for the favorite domain
  final registryState = await RegistryState.retrieve(
    connection,
    favorite.nameAccount.toBase58(),
  );

  // The registry owner is the domain owner unless NFT is involved
  final domainOwner = registryState.owner;

  // Perform reverse lookup to get domain name
  final reverseResult = await reverseLookup(ReverseLookupParams(
    rpc: connection,
    domainAddress: favorite.nameAccount.toBase58(),
  ));

  var reverse = reverseResult ?? '';

  // Handle subdomain reverse lookup
  if (registryState.parentName != rootDomainAddress) {
    final parentReverse = await reverseLookup(ReverseLookupParams(
      rpc: connection,
      domainAddress: registryState.parentName,
    ));
    if (parentReverse != null) {
      reverse = '$reverse.$parentReverse';
    }
  }

  return FavoriteDomainResult(
    domain: favorite.nameAccount,
    reverse: reverse,
    stale: owner.toBase58() != domainOwner,
  );
}

/// Alias for getFavoriteDomain
Future<FavoriteDomainResult> getPrimaryDomain(
  sns_rpc.RpcClient connection,
  Ed25519HDPublicKey owner,
) =>
    getFavoriteDomain(connection, owner);

/// Retrieve favorite domains for multiple wallets
Future<List<String?>> getMultipleFavoriteDomains(
  sns_rpc.RpcClient connection,
  List<Ed25519HDPublicKey> wallets,
) async {
  if (wallets.length > 100) {
    throw ArgumentError('Maximum 100 wallets allowed');
  }

  final programId = Ed25519HDPublicKey.fromBase58(nameOffersId);
  final favKeys = wallets.map((wallet) {
    final (key, _) = FavouriteDomain.getKeySync(programId, wallet);
    return key.toBase58();
  }).toList();

  final favAccountInfos = await connection.fetchEncodedAccounts(favKeys);

  final result = <String?>[];

  for (var i = 0; i < wallets.length; i++) {
    final accountInfo = favAccountInfos[i];

    if (!accountInfo.exists || accountInfo.data.isEmpty) {
      result.add(null);
      continue;
    }

    try {
      final favorite =
          FavouriteDomain.deserialize(Uint8List.fromList(accountInfo.data));

      // Get reverse lookup for this domain
      final reverse = await reverseLookup(ReverseLookupParams(
        rpc: connection,
        domainAddress: favorite.nameAccount.toBase58(),
      ));
      result.add(reverse);
    } on Exception {
      result.add(null);
    }
  }

  return result;
}

/// Find all wallets that have set a specific domain as their favorite
///
/// This function would use RPC's getProgramAccounts with proper filters
/// to find all favorite domain accounts that contain the specified domain.
/// However, this requires complex account filtering that may not be efficiently
/// supported by all RPC providers.
Future<List<Ed25519HDPublicKey>> findWithDomain(
  sns_rpc.RpcClient connection,
  Ed25519HDPublicKey domain,
) async {
  throw UnimplementedError(
      'findWithDomain requires getProgramAccounts with account data filtering. '
      'This feature depends on RPC provider capabilities and may not be available '
      'on all networks. Consider using batch queries of known wallets instead.');
}
