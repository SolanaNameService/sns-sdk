import 'dart:typed_data';
import 'ed25519.dart';

/// Checks if an address is on the Ed25519 curve.
///
/// This function mirrors js-kit/src/utils/checkAddressOnCurve/index.ts
/// It decompresses the address bytes and checks if the resulting point
/// lies on the Ed25519 curve.
///
/// [addressBytes] - The 32-byte address to check
///
/// Returns true if the address is on the curve (invalid for PDA)
bool checkAddressOnCurve(Uint8List addressBytes) {
  if (addressBytes.length != 32) {
    return false;
  }

  try {
    // Decompress the point from the address bytes
    final y = _decompressPointBytes(addressBytes);
    final signBit = addressBytes[31] >> 7; // Extract the sign bit

    return pointIsOnCurve(y, signBit);
  } on Exception {
    return false;
  }
}

/// Decompresses point bytes to extract the y-coordinate.
///
/// This mirrors the JavaScript implementation that builds a hex string
/// from the bytes and converts it to a BigInt.
BigInt _decompressPointBytes(Uint8List bytes) {
  final hexString = bytes.reversed.map(_byteToHex).join();

  // Clear the sign bit from the last byte (first in reversed order)
  final lastByteIndex = bytes.length - 1;
  final lastByte = bytes[lastByteIndex] & ~0x80; // Clear the MSB
  final correctedHexString = hexString.substring(2) + _byteToHex(lastByte);

  return BigInt.parse(correctedHexString, radix: 16);
}

/// Converts a byte to a hex string with padding.
String _byteToHex(int byte) {
  final hexString = byte.toRadixString(16);
  return hexString.length == 1 ? '0$hexString' : hexString;
}
