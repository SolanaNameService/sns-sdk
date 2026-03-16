import 'dart:typed_data';
import 'package:solana/solana.dart' hide RpcClient;
import '../rpc/rpc_client.dart';

/// Header length for name registry accounts
const int nameRegistryHeaderLen = 96;

/// State for reverse Twitter registry accounts
class ReverseTwitterRegistryState {
  const ReverseTwitterRegistryState({
    required this.twitterRegistryKey,
    required this.twitterHandle,
  });
  final Uint8List twitterRegistryKey;
  final String twitterHandle;

  /// Borsh schema definition
  static const Map<String, dynamic> schema = {
    'struct': {
      'twitterRegistryKey': {
        'array': {'type': 'u8', 'len': 32}
      },
      'twitterHandle': 'string',
    }
  };

  /// Retrieve a reverse Twitter registry state from the blockchain
  static Future<ReverseTwitterRegistryState> retrieve(
    RpcClient connection,
    Ed25519HDPublicKey pubkey,
  ) async {
    final accountInfo = await connection.fetchEncodedAccount(pubkey.toBase58());

    if (!accountInfo.exists) {
      throw Exception('Account does not exist');
    }

    if (accountInfo.data.isEmpty) {
      throw Exception('Account data is empty');
    }

    // Skip header and deserialize
    final accountData = Uint8List.fromList(
        accountInfo.data.skip(nameRegistryHeaderLen).toList());
    return ReverseTwitterRegistryState.deserialize(accountData);
  }

  /// Deserialize from Borsh-encoded data
  static ReverseTwitterRegistryState deserialize(Uint8List data) {
    if (data.length < 32) {
      throw Exception('Insufficient data for ReverseTwitterRegistryState');
    }

    // Read 32-byte twitter registry key
    final twitterRegistryKey = data.sublist(0, 32);

    // Read string length (4 bytes)
    final stringLength =
        ByteData.sublistView(data, 32, 36).getUint32(0, Endian.little);

    // Read twitter handle string
    final twitterHandle =
        String.fromCharCodes(data.sublist(36, 36 + stringLength));

    return ReverseTwitterRegistryState(
      twitterRegistryKey: twitterRegistryKey,
      twitterHandle: twitterHandle,
    );
  }

  /// Serialize to Borsh-encoded data
  Uint8List serialize() {
    final handleBytes = Uint8List.fromList(twitterHandle.codeUnits);
    final totalLength = 32 + 4 + handleBytes.length;
    final result = Uint8List(totalLength);

    // Write twitter registry key (32 bytes)
    result.setRange(0, 32, twitterRegistryKey);

    // Write string length (4 bytes, little endian)
    ByteData.sublistView(result, 32, 36)
        .setUint32(0, handleBytes.length, Endian.little);

    // Write twitter handle string
    result.setRange(36, 36 + handleBytes.length, handleBytes);

    return result;
  }

  /// Convert twitter registry key bytes to PublicKey
  Ed25519HDPublicKey get twitterRegistryKeyPubkey =>
      Ed25519HDPublicKey(twitterRegistryKey);
}
