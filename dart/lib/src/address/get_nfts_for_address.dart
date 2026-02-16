import '../constants/addresses.dart';
import '../rpc/rpc_client.dart';
import '../states/nft.dart';
import '../utils/reverse_lookup_batch.dart';

/// Result containing NFT domain information for tokenized domains.
class NftResult {
  /// Creates an NFT result.
  const NftResult({
    required this.domain,
    required this.domainAddress,
    required this.mint,
  });

  /// Human-readable domain name.
  final String domain;

  /// Domain address on blockchain.
  final String domainAddress;

  /// NFT mint address.
  final String mint;
}

/// Parameters for retrieving NFTs owned by an address.
class GetNftsForAddressParams {
  /// Creates NFT retrieval parameters.
  const GetNftsForAddressParams({
    required this.rpc,
    required this.address,
  });

  /// RPC client for blockchain operations.
  final RpcClient rpc;

  /// Address to get NFTs for.
  final String address;
}

/// Parameters for getting NFT states for an address
class _GetNftStatesForAddressParams {
  const _GetNftStatesForAddressParams({
    required this.rpc,
    required this.address,
  });

  /// The RPC client for blockchain interaction
  final RpcClient rpc;

  /// The address whose associated NFT states are to be fetched
  final String address;
}

/// Fetches NFT states for a given address.
///
/// This function queries the token program for accounts associated
/// address and retrieves the corresponding NFT states.
///
/// [params] - Parameters containing RPC client and address
///
/// Returns a list of NftState objects
Future<List<NftState>> _getNftStatesForAddress(
    _GetNftStatesForAddressParams params) async {
  try {
    final results = await params.rpc.getProgramAccounts(
      tokenProgramAddress,
      encoding: 'base64',
      filters: [
        MemcmpFilter(
          offset: 32,
          bytes: params.address,
          encoding: 'base58',
        ),
        const MemcmpFilter(
          offset: 64,
          bytes: '2',
          encoding: 'base58',
        ),
        const DataSizeFilter(size: 165),
      ],
    );

    final nftStates = <NftState>[];

    for (final result in results) {
      try {
        // Extract mint from token account data (first 32 bytes)
        final mintBytes = result.account.data.take(32).toList();
        final mint = _base58Encode(mintBytes);

        final nftState = await NftState.retrieveFromMint(GetNftFromMintParams(
          rpc: params.rpc,
          mint: mint,
        ));

        if (nftState != null) {
          nftStates.add(nftState);
        }
      } on Exception {
        // Continue processing other NFTs if one fails
        continue;
      }
    }

    return nftStates;
  } on Exception {
    // Return empty list if there's an error retrieving NFT records
    return [];
  }
}

/// Retrieves all tokenized domains (NFTs) owned by a given address.
///
/// This function combines NFT state retrieval with reverse domain lookup
/// to provide complete NFT domain information including human-readable
/// domain names and blockchain addresses.
///
/// Tokenized domains are domains that have been converted to NFTs for
/// trading and transferability while maintaining their resolution capabilities.
///
/// Example:
/// ```dart
/// final nfts = await getNftsForAddress(GetNftsForAddressParams(
///   rpc: rpcClient,
///   address: ownerAddress,
/// ));
///
/// for (final nft in nfts) {
///   print('NFT Domain: ${nft.domain} (${nft.mint})');
/// }
/// ```
///
/// [params] Owner address and RPC client configuration.
///
/// Returns list of [NftResult] objects containing domain name, domain address,
/// and NFT mint address.
///
/// Returns empty list if address owns no NFT domains or on retrieval error.
Future<List<NftResult>> getNftsForAddress(
    GetNftsForAddressParams params) async {
  final nftStates = await _getNftStatesForAddress(
    _GetNftStatesForAddressParams(
      rpc: params.rpc,
      address: params.address,
    ),
  );

  final nftNameAccounts = nftStates.map((state) => state.nameAccount).toList();

  final domains = await reverseLookupBatch(ReverseLookupBatchParams(
    rpc: params.rpc,
    domainAddresses: nftNameAccounts,
  ));

  final results = <NftResult>[];

  for (var i = 0; i < domains.length; i++) {
    final domain = domains[i];
    if (domain != null) {
      results.add(NftResult(
        domain: domain,
        domainAddress: nftStates[i].nameAccount,
        mint: nftStates[i].nftMint,
      ));
    }
  }

  return results;
}

/// Helper function to encode bytes as base58
String _base58Encode(List<int> input) {
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

  if (input.isEmpty) {
    return '';
  }

  // Count leading zeros
  var leadingZeros = 0;
  for (var i = 0; i < input.length && input[i] == 0; i++) {
    leadingZeros++;
  }

  // Convert to base58
  final digits = <int>[0];
  for (final byte in input) {
    var carry = byte;
    for (var i = 0; i < digits.length; i++) {
      carry += digits[i] * 256;
      digits[i] = carry % 58;
      carry ~/= 58;
    }
    while (carry > 0) {
      digits.add(carry % 58);
      carry ~/= 58;
    }
  }

  // Build result string
  final result = StringBuffer();

  // Add leading '1's for leading zeros
  for (var i = 0; i < leadingZeros; i++) {
    result.write('1');
  }

  // Add base58 digits in reverse order
  for (var i = digits.length - 1; i >= 0; i--) {
    result.write(alphabet[digits[i]]);
  }

  return result.toString();
}
