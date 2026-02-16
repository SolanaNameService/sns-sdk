import 'dart:convert';
import 'dart:typed_data';

/// Parameters for deserializing reverse account data
class DeserializeReverseParams {
  const DeserializeReverseParams({
    required this.data,
    this.trimFirstNullByte = false,
  });

  /// The data to deserialize
  final Uint8List? data;

  /// Whether to trim the first null byte from the result string
  final bool trimFirstNullByte;
}

/// Deserializes reverse account data.
///
/// This function mirrors js-kit/src/utils/deserializers/deserializeReverse.ts
///
/// [data] - The Uint8List to deserialize. If null, returns null.
/// [trimFirstNullByte] - Whether to trim the first null byte from the result string
///
/// Returns the deserialized string, or null if data is null.
String? deserializeReverse(Uint8List? data, {bool trimFirstNullByte = false}) {
  if (data == null) return null;

  final byteData = ByteData.sublistView(data);
  final nameLength = byteData.getUint32(0, Endian.little);

  if (data.length < 4 + nameLength) return null;

  final nameBytes = data.sublist(4, 4 + nameLength);
  var result = utf8.decode(nameBytes);

  if (trimFirstNullByte && result.startsWith('\u0000')) {
    result = result.substring(1);
  }

  return result;
}
