import 'dart:convert';
import 'dart:typed_data';

import '../constants/records.dart';
import '../errors/sns_errors.dart';
import 'base58_utils.dart';

/// Parameters for deserializing record content
class DeserializeRecordContentParams {
  const DeserializeRecordContentParams({
    required this.content,
    required this.record,
  });

  /// The content to deserialize
  final Uint8List content;

  /// The type of record
  final Record record;
}

/// Deserialize record content based on the record type
///
/// This function mirrors js-kit/src/utils/deserializers/deserializeRecordContent.ts
///
/// [content] - The content to deserialize
/// [record] - The type of record
///
/// Returns the deserialized content as a string
String deserializeRecordContent({
  required Uint8List content,
  required Record record,
}) {
  final isUtf8Encoded = utf8EncodedRecords.contains(record);

  if (isUtf8Encoded) {
    final decoded = utf8.decode(content);
    if (record == Record.cname || record == Record.txt) {
      // In a full implementation, this would use punycode decoding
      // For now, return the decoded UTF-8 string
      return decoded;
    }
    return decoded;
  } else if (record == Record.sol) {
    return _base58Encode(content);
  } else if (evmRecords.contains(record)) {
    return '0x${_uint8ArrayToHex(content)}';
  } else if (record == Record.injective) {
    // In a full implementation, this would use bech32 encoding
    // For now, return a placeholder
    return 'inj${_uint8ArrayToHex(content)}';
  } else if (record == Record.a || record == Record.aaaa) {
    // IP address deserialization
    if (record == Record.a && content.length == 4) {
      return '${content[0]}.${content[1]}.${content[2]}.${content[3]}';
    } else if (record == Record.aaaa && content.length == 16) {
      final groups = <String>[];
      for (var i = 0; i < 16; i += 2) {
        final group = (content[i] << 8) | content[i + 1];
        groups.add(group.toRadixString(16));
      }
      return groups.join(':');
    } else {
      throw InvalidRecordDataError('Invalid IP address record length');
    }
  } else {
    throw InvalidRecordDataError('The record content is malformed');
  }
}

/// Convert uint8 array to hex string
String _uint8ArrayToHex(Uint8List bytes) =>
    bytes.map((byte) => byte.toRadixString(16).padLeft(2, '0')).join();

/// Base58 encode helper
String _base58Encode(Uint8List bytes) => Base58Utils.encode(bytes);
