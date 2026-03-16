import 'package:solana/solana.dart' hide RpcClient;

import '../constants/addresses.dart';
import '../rpc/rpc_client.dart';
import 'get_domain_mint.dart';

/// This function can be used to retrieve the owner of a tokenized domain name
///
/// This function mirrors js/src/nft/retrieveNftOwner.ts
///
/// [rpc] - The RPC client for Solana blockchain communication
/// [nameAccount] - The key of the domain name
///
/// Returns the owner public key, or null if not tokenized
Future<Ed25519HDPublicKey?> retrieveNftOwner(
  RpcClient rpc,
  Ed25519HDPublicKey nameAccount,
) async {
  try {
    final mint = await getDomainMint(nameAccount);

    // Check if the mint has any supply (NFT exists)
    final mintAccount = await rpc.fetchEncodedAccount(mint.toBase58());
    if (!mintAccount.exists || mintAccount.data.isEmpty) {
      return null;
    }

    // Parse mint data to check supply using proper mint account structure
    // Use the getMint method from espresso-cash-public Solana package
    try {
      final mintData = await rpc.fetchEncodedAccount(mint.toBase58());
      if (!mintData.exists || mintData.data.isEmpty) {
        return null;
      }

      // Parse mint account data - mint structure has supply at bytes 36-44 (u64 little endian)
      final data = mintData.data;
      if (data.length < 82) {
        // Minimum mint account size
        return null;
      }

      // Extract supply (8 bytes starting at offset 36)
      var supply = 0;
      for (var i = 0; i < 8; i++) {
        supply += data[36 + i] << (8 * i);
      }

      if (supply == 0) {
        return null;
      }
    } on Exception {
      return null;
    }

    // Create filters to find the token account for this mint
    final filters = <AccountFilter>[
      MemcmpFilter(
        offset: 0, // Mint address at beginning of token account
        bytes: mint.toBase58(),
        encoding: 'base58',
      ),
      const MemcmpFilter(
        offset: 64, // Token account state (initialized = 1)
        bytes: '2',
        encoding: 'base58',
      ),
      const DataSizeFilter(size: 165), // SPL Token account size
    ];

    // Get token program accounts for this mint
    final result = await rpc.getProgramAccounts(
      tokenProgramAddress, // SPL Token program ID
      encoding: 'base64',
      filters: filters,
    );

    if (result.length != 1) {
      return null;
    }

    // Extract owner from token account data
    // Token account layout: mint(32) + owner(32) + amount(8) + ...
    final tokenAccountData = result[0].account.data;
    if (tokenAccountData.length >= 64) {
      final ownerBytes = tokenAccountData.sublist(32, 64);
      return Ed25519HDPublicKey(ownerBytes);
    }

    return null;
  } on Exception {
    return null;
  }
}
