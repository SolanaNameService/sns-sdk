import 'dart:typed_data';
import 'package:solana/solana.dart';

/// Utility class for Base58 encoding/decoding operations
/// Uses the official solana package when possible for maximum compatibility
class Base58Utils {
  /// Base58 alphabet used by Solana
  static const String _alphabet =
      '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

  /// Encode bytes to base58 string
  static String encode(Uint8List bytes) {
    if (bytes.isEmpty) return '';

    // Count leading zeros
    var leadingZeros = 0;
    for (var i = 0; i < bytes.length; i++) {
      if (bytes[i] == 0) {
        leadingZeros++;
      } else {
        break;
      }
    }

    // Convert to BigInt
    var value = BigInt.zero;
    for (var i = 0; i < bytes.length; i++) {
      value = value * BigInt.from(256) + BigInt.from(bytes[i]);
    }

    // Encode to base58
    final result = <String>[];
    final base = BigInt.from(58);

    while (value > BigInt.zero) {
      final remainder = (value % base).toInt();
      result.insert(0, _alphabet[remainder]);
      value = value ~/ base;
    }

    // Add leading ones for leading zeros
    for (var i = 0; i < leadingZeros; i++) {
      result.insert(0, '1');
    }

    return result.join();
  }

  /// Decode base58 string to bytes
  /// First tries to use solana package for public keys, falls back to custom decode
  static List<int> decode(String input) {
    if (input.isEmpty) return [];

    // If it looks like a public key (32 bytes when decoded), try solana package first
    if (input.length >= 32 && input.length <= 44) {
      try {
        final pubkey = Ed25519HDPublicKey.fromBase58(input);
        return pubkey.bytes;
      } on Exception {
        // Fall through to custom decode
      }
    }

    return _customDecode(input);
  }

  /// Custom base58 decoder for non-public-key data
  static List<int> _customDecode(String input) {
    if (input.isEmpty) return [];

    // Count leading zeros
    var leadingZeros = 0;
    for (var i = 0; i < input.length; i++) {
      if (input[i] == '1') {
        leadingZeros++;
      } else {
        break;
      }
    }

    // Decode base58
    var decoded = BigInt.zero;
    final base = BigInt.from(58);

    for (var i = leadingZeros; i < input.length; i++) {
      final char = input[i];
      final index = _alphabet.indexOf(char);
      if (index == -1) {
        throw ArgumentError('Invalid base58 character: $char');
      }
      decoded = decoded * base + BigInt.from(index);
    }

    // Convert to bytes
    final bytes = <int>[];
    while (decoded > BigInt.zero) {
      bytes.insert(0, (decoded % BigInt.from(256)).toInt());
      decoded = decoded ~/ BigInt.from(256);
    }

    // Add leading zeros
    for (var i = 0; i < leadingZeros; i++) {
      bytes.insert(0, 0);
    }

    return bytes;
  }
}
