import 'package:solana/solana.dart' hide RpcClient;
import '../rpc/rpc_client.dart';
import 'get_domain_mint.dart';

/// V2 function to retrieve the owner of a tokenized domain name
///
/// This function mirrors js/src/nft/retrieveNftOwnerV2.ts
///
/// [rpc] - The RPC client for Solana blockchain communication
/// [nameAccount] - The key of the domain name
///
/// Returns the owner public key, or null if not tokenized
Future<Ed25519HDPublicKey?> retrieveNftOwnerV2(
  RpcClient rpc,
  Ed25519HDPublicKey nameAccount,
) async {
  try {
    final mint = await getDomainMint(nameAccount);

    // Get the largest token accounts for this mint
    final largestAccounts = await rpc.getTokenLargestAccounts(mint.toBase58());
    if (largestAccounts.isEmpty) {
      return null;
    }

    // Get account info for the largest account
    final largestAccountInfo = await rpc.fetchEncodedAccount(
      largestAccounts[0].address,
    );

    if (!largestAccountInfo.exists) {
      return null;
    }

    // Parse token account data
    // Token account layout: mint(32) + owner(32) + amount(8) + ...
    final data = largestAccountInfo.data;
    if (data.length >= 72) {
      // Ensure we have enough data for amount
      final ownerBytes = data.sublist(32, 64);

      // Check amount (8 bytes, little endian) - should be 1 for NFT
      final amountBytes = data.sublist(64, 72);
      var amount = 0;
      for (var i = 0; i < 8; i++) {
        amount += amountBytes[i] << (i * 8);
      }

      if (amount == 1) {
        return Ed25519HDPublicKey(ownerBytes);
      }
    }

    return null;
  } on Exception {
    // Handle RPC errors (mint does not exist, etc.)
    return null;
  }
}
