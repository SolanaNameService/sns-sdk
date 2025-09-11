import 'dart:typed_data';
import 'package:solana/base58.dart';
import '../rpc/rpc_client.dart';

/// Registry state class for domain ownership information
///
/// This mirrors the RegistryState from js-kit/src/states/registry.ts
class RegistryState {
  const RegistryState({
    required this.parentName,
    required this.owner,
    required this.classAddress,
    this.data,
  });

  /// Header length in bytes
  static const int headerLen = 96;

  /// The parent name address
  final String parentName;

  /// The owner of the domain
  final String owner;

  /// The class address
  final String classAddress;

  /// Additional registry data
  final Uint8List? data;

  /// Deserializes registry state from account data
  ///
  /// [data] - The raw account data
  ///
  /// Returns a RegistryState instance
  static RegistryState deserialize(Uint8List data) {
    if (data.length < headerLen) {
      throw ArgumentError('Invalid registry data length');
    }

    // Extract parent name address from bytes 0-32
    final parentNameBytes = data.sublist(0, 32);
    final parentName = _base58Encode(parentNameBytes);

    // Extract owner address from bytes 32-64
    final ownerBytes = data.sublist(32, 64);
    final owner = _base58Encode(ownerBytes);

    // Extract class address from bytes 64-96
    final classBytes = data.sublist(64, 96);
    final classAddress = _base58Encode(classBytes);

    // Get additional data after header
    final additionalData =
        data.length > headerLen ? data.sublist(headerLen) : null;

    return RegistryState(
      parentName: parentName,
      owner: owner,
      classAddress: classAddress,
      data: additionalData,
    );
  }

  /// Retrieves registry state from RPC
  ///
  /// [rpc] - The RPC client
  /// [address] - The address to retrieve
  ///
  /// Returns a RegistryState instance
  static Future<RegistryState> retrieve(RpcClient rpc, String address) async {
    final accountInfo = await rpc.fetchEncodedAccount(address);
    if (!accountInfo.exists) {
      throw ArgumentError('The domain account does not exist');
    }

    return deserialize(Uint8List.fromList(accountInfo.data));
  }

  /// Retrieves multiple registry states from RPC
  ///
  /// [rpc] - The RPC client
  /// [addresses] - The addresses to retrieve
  ///
  /// Returns a list of RegistryState instances or null
  static Future<List<RegistryState?>> retrieveBatch(
    RpcClient rpc,
    List<String> addresses,
  ) async {
    final accountInfos = await rpc.fetchEncodedAccounts(addresses);

    return accountInfos.map((accountInfo) {
      if (!accountInfo.exists) return null;
      return deserialize(Uint8List.fromList(accountInfo.data));
    }).toList();
  }

  /// Robust Base58 encode using the solana package for maximum compatibility
  static String _base58Encode(Uint8List input) {
    if (input.isEmpty) return '';

    try {
      return base58encode(input);
    } on Exception {
      // Fallback to simple encode if needed
      return _simpleBase58Encode(input);
    }
  }

  /// Simple base58 encode fallback
  static String _simpleBase58Encode(Uint8List input) {
    const alphabet =
        '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

    if (input.isEmpty) return '';

    // Count leading zeros
    var leadingZeros = 0;
    for (var i = 0; i < input.length; i++) {
      if (input[i] == 0) {
        leadingZeros++;
      } else {
        break;
      }
    }

    // Convert to BigInt
    var value = BigInt.zero;
    for (var i = 0; i < input.length; i++) {
      value = value * BigInt.from(256) + BigInt.from(input[i]);
    }

    // Encode to base58
    final result = <String>[];
    final base = BigInt.from(58);

    while (value > BigInt.zero) {
      final remainder = (value % base).toInt();
      result.insert(0, alphabet[remainder]);
      value = value ~/ base;
    }

    // Add leading ones for leading zeros
    for (var i = 0; i < leadingZeros; i++) {
      result.insert(0, '1');
    }

    return result.join();
  }
}
