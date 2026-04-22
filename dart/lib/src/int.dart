import 'dart:typed_data';
import 'errors/sns_errors.dart';

/// 32-bit unsigned integer wrapper
///
/// This class mirrors js/src/int.ts Numberu32
class Numberu32 {
  /// Constructor from various numeric types
  Numberu32(dynamic val) : value = BigInt.from(val);

  /// The BigInt value
  final BigInt value;

  /// Convert to Uint8List representation (little-endian)
  Uint8List toBuffer() {
    final buffer = Uint8List(4);
    final byteData = ByteData.sublistView(buffer);
    byteData.setUint32(0, value.toInt(), Endian.little);
    return buffer;
  }

  /// Construct a Numberu32 from Uint8List representation
  static Numberu32 fromBuffer(Uint8List buffer) {
    if (buffer.length != 4) {
      throw InvalidBufferLengthError(
        'Invalid buffer length: ${buffer.length}',
      );
    }

    final byteData = ByteData.sublistView(buffer);
    final value = byteData.getUint32(0, Endian.little);
    return Numberu32(value);
  }

  /// Convert to int
  int toNumber() => value.toInt();

  /// Convert to string
  @override
  String toString() => value.toString();

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Numberu32 &&
          runtimeType == other.runtimeType &&
          value == other.value;

  @override
  int get hashCode => value.hashCode;
}

/// 64-bit unsigned integer wrapper
///
/// This class mirrors js/src/int.ts Numberu64
class Numberu64 {
  /// Constructor from various numeric types
  Numberu64(dynamic val) : value = BigInt.from(val);

  /// The BigInt value
  final BigInt value;

  /// Convert to Uint8List representation (little-endian)
  Uint8List toBuffer() {
    final buffer = Uint8List(8);
    final byteData = ByteData.sublistView(buffer);
    byteData.setUint64(0, value.toInt(), Endian.little);
    return buffer;
  }

  /// Construct a Numberu64 from Uint8List representation
  static Numberu64 fromBuffer(Uint8List buffer) {
    if (buffer.length != 8) {
      throw U64OverflowError(
        'Invalid buffer length: ${buffer.length}',
      );
    }

    final byteData = ByteData.sublistView(buffer);
    final value = byteData.getUint64(0, Endian.little);
    return Numberu64(value);
  }

  /// Convert to int
  int toNumber() => value.toInt();

  /// Convert to string
  @override
  String toString() => value.toString();

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Numberu64 &&
          runtimeType == other.runtimeType &&
          value == other.value;

  @override
  int get hashCode => value.hashCode;
}
