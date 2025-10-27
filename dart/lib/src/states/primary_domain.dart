import 'dart:typed_data';

import '../rpc/rpc_client.dart';

/// Primary domain state class for managing favorite domain associations
///
/// This mirrors the PrimaryDomainState from js-kit/src/states/primaryDomain.ts
class PrimaryDomainState {
  const PrimaryDomainState({
    required this.tag,
    required this.nameAccount,
  });

  /// The tag indicating the state type
  final int tag;

  /// The domain address associated with this primary domain
  final String nameAccount;

  /// Deserializes primary domain state from account data
  ///
  /// [data] - The raw account data
  ///
  /// Returns a PrimaryDomainState instance
  static PrimaryDomainState deserialize(Uint8List data) {
    if (data.length < 33) {
      throw ArgumentError(
          'Invalid primary domain data length: expected at least 33, got ${data.length}');
    }

    // Extract tag from first byte
    final tag = data[0];

    // Extract name account (bytes 1-32)
    final nameAccountBytes = data.sublist(1, 33);
    final nameAccount = _base58Encode(nameAccountBytes);

    return PrimaryDomainState(
      tag: tag,
      nameAccount: nameAccount,
    );
  }

  /// Retrieves primary domain state from account address
  ///
  /// [rpc] - The RPC client
  /// [address] - The primary domain account address
  ///
  /// Returns the primary domain state
  static Future<PrimaryDomainState> retrieve(
      RpcClient rpc, String address) async {
    final primaryDomainAccount = await rpc.fetchEncodedAccount(address);
    if (!primaryDomainAccount.exists) {
      throw StateError('The favorite account does not exist');
    }
    return deserialize(Uint8List.fromList(primaryDomainAccount.data));
  }

  /// Internal batch retrieval method
  ///
  /// [rpc] - The RPC client
  /// [primaryAddresses] - List of primary domain addresses
  ///
  /// Returns list of primary domain states (null for non-existent accounts)
  static Future<List<PrimaryDomainState?>> _retrieveBatch(
    RpcClient rpc,
    List<String> primaryAddresses,
  ) async {
    final domainAccounts = await rpc.fetchEncodedAccounts(primaryAddresses);

    return domainAccounts
        .map((account) => account.exists
            ? deserialize(Uint8List.fromList(account.data))
            : null)
        .toList();
  }

  /// Retrieves multiple primary domain states in batches
  ///
  /// [rpc] - The RPC client
  /// [primaryAddresses] - List of primary domain addresses
  ///
  /// Returns list of primary domain states (null for non-existent accounts)
  static Future<List<PrimaryDomainState?>> retrieveBatch(
    RpcClient rpc,
    List<String> primaryAddresses,
  ) async {
    final result = <PrimaryDomainState?>[];
    final addresses = [...primaryAddresses];

    while (addresses.isNotEmpty) {
      final batch = addresses.take(100).toList();
      addresses.removeRange(0, batch.length);

      final batchResult = await _retrieveBatch(rpc, batch);
      result.addAll(batchResult);
    }

    return result;
  }

  /// Gets the primary domain address for a wallet address
  ///
  /// [programAddress] - The program address (NAME_OFFERS_ADDRESS)
  /// [walletAddress] - The wallet address
  ///
  /// Returns the derived primary domain address
  static Future<String> getAddress(
      String programAddress, String walletAddress) async {
    // This would typically derive the address using PDA generation with seeds:
    // ["favourite_domain", walletAddress] and programAddress
    // For now, return a placeholder - in a full implementation this would
    // use proper PDA derivation
    return 'PRIMARY_DOMAIN_ADDRESS_${programAddress}_$walletAddress';
  }

  /// Base58 encode helper
  static String _base58Encode(Uint8List input) {
    const alphabet =
        '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

    if (input.isEmpty) return '';

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
}
