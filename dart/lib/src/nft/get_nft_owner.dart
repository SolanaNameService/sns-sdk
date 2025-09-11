import 'dart:typed_data';

import '../rpc/rpc_client.dart';
import '../utils/base58_utils.dart';
import 'get_nft_mint.dart';

/// Parameters for getting NFT owner
class GetNftOwnerParams {
  const GetNftOwnerParams({
    required this.rpc,
    required this.domainAddress,
  });

  /// The RPC client for blockchain interaction
  final RpcClient rpc;

  /// The domain address whose NFT owner is to be retrieved
  final String domainAddress;
}

/// Token account information
class TokenAccountInfo {
  const TokenAccountInfo({
    required this.amount,
    required this.owner,
  });

  /// Token amount
  final String amount;

  /// Token owner address
  final String owner;
}

/// Retrieves the owner of a tokenized domain.
///
/// This matches js-kit/src/nft/getNftOwner.ts
///
/// [params] - Parameters containing RPC client and domain address
///
/// Returns the NFT owner's address, or null if no owner is found
Future<String?> getNftOwner(GetNftOwnerParams params) async {
  try {
    final mint = await getNftMint(GetNftMintParams(
      domainAddress: params.domainAddress,
    ));

    final largestAccounts = await params.rpc.getTokenLargestAccounts(mint);

    if (largestAccounts.isEmpty) {
      return null;
    }

    final largestAccountInfo = await params.rpc.fetchEncodedAccount(
      largestAccounts.first.address,
    );

    if (!largestAccountInfo.exists) {
      return null;
    }

    final decoded = _decodeTokenAccount(largestAccountInfo.data);
    if (decoded.amount == '1') {
      return decoded.owner;
    }

    return null;
  } on Exception {
    // If invalid params or other RPC error, return null
    return null;
  }
}

/// Robust token account decoder using proper SPL Token account structure
TokenAccountInfo _decodeTokenAccount(List<int> data) {
  // SPL Token account structure (165 bytes total):
  // - mint: 32 bytes (0-31)
  // - owner: 32 bytes (32-63)
  // - amount: 8 bytes (64-71) - little-endian u64
  // - delegate: 36 bytes (72-107) - optional + 32 bytes
  // - state: 1 byte (108)
  // - is_native: 12 bytes (109-120) - optional + 8 bytes
  // - delegated_amount: 8 bytes (121-128) - little-endian u64
  // - close_authority: 36 bytes (129-164) - optional + 32 bytes

  if (data.length < 165) {
    throw ArgumentError(
        'Invalid token account data length: ${data.length}, expected 165 bytes');
  }

  // Extract owner (bytes 32-63)
  final ownerBytes = Uint8List.fromList(data.sublist(32, 64));
  final owner = Base58Utils.encode(ownerBytes);

  // Extract amount (bytes 64-71, little-endian u64)
  var amount = 0;
  for (var i = 0; i < 8; i++) {
    amount |= data[64 + i] << (i * 8);
  }

  return TokenAccountInfo(
    amount: amount.toString(),
    owner: owner,
  );
}
