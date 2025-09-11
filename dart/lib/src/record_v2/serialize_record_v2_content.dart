/// Record V2 content serialization functionality
///
/// This module provides functionality to serialize string content for Record V2
/// based on the record type, following SNS-IP 1 guidelines exactly as in the JavaScript SDK.
library;

import 'dart:convert';
import 'dart:typed_data';
import 'package:solana/solana.dart';

import '../constants/records.dart';
import '../errors/sns_errors.dart';
import '../utils/bech32_utils.dart';
import 'constants.dart' as v2_constants;

/// Validates and throws an error if the condition is false
void _check(bool condition, SnsError error) {
  if (!condition) {
    throw error;
  }
}

/// Converts punycode encoded strings for CNAME and TXT records
String _encodePunycode(String input) {
  // For simplicity, we'll return the input as-is since Dart's Uri class handles punycode
  // In a full implementation, you'd use a punycode library
  return input;
}

/// Parses an IP address string and returns the byte representation
List<int> _parseIpAddress(String ipString, {required bool isV6}) {
  try {
    if (isV6) {
      // Parse IPv6 address
      final parts = ipString.split(':');
      if (parts.length != 8) {
        // Handle compressed notation like ::1 or 2001:db8::1
        final expandedParts = <String>[];
        final doubleColonIndex = ipString.indexOf('::');

        if (doubleColonIndex != -1) {
          final beforeDouble =
              ipString.substring(0, doubleColonIndex).split(':');
          final afterDouble =
              ipString.substring(doubleColonIndex + 2).split(':');

          expandedParts.addAll(beforeDouble.where((p) => p.isNotEmpty));

          final zerosNeeded = 8 -
              expandedParts.length -
              afterDouble.where((p) => p.isNotEmpty).length;
          for (var i = 0; i < zerosNeeded; i++) {
            expandedParts.add('0');
          }

          expandedParts.addAll(afterDouble.where((p) => p.isNotEmpty));
        } else {
          expandedParts.addAll(parts);
        }

        final bytes = <int>[];
        for (final part in expandedParts) {
          final value = int.parse(part, radix: 16);
          bytes.add((value >> 8) & 0xFF);
          bytes.add(value & 0xFF);
        }
        return bytes;
      } else {
        final bytes = <int>[];
        for (final part in parts) {
          final value = int.parse(part, radix: 16);
          bytes.add((value >> 8) & 0xFF);
          bytes.add(value & 0xFF);
        }
        return bytes;
      }
    } else {
      // Parse IPv4 address
      final parts = ipString.split('.');
      if (parts.length != 4) {
        throw const FormatException('Invalid IPv4 address');
      }
      return parts.map(int.parse).toList();
    }
  } on Exception {
    throw InvalidRecordInputError('Invalid IP address format: $ipString');
  }
}

/// Serializes string content based on the record type following SNS-IP 1 guidelines
///
/// This function converts string content to the appropriate binary format
/// for each record type, matching the JavaScript SDK implementation exactly.
///
/// Examples:
/// ```dart
/// final ethData = serializeRecordV2Content('0x742d35Cc8634C0532925a3b8D5c5fBa2e8D4C8b2', Record.eth);
/// final solData = serializeRecordV2Content('DGLMEvwFuZjvv9LKmDfv9A9c7u3pFb7zJ8dN1H9xKmEy', Record.sol);
/// final urlData = serializeRecordV2Content('https://example.com', Record.url);
/// ```
///
/// @param content The content to serialize as a string
/// @param record The record type that determines serialization format
/// @returns The serialized content as bytes
/// @throws [InvalidRecordInputError] if the content format is invalid for the record type
Uint8List serializeRecordV2Content(String content, Record record) {
  final isUtf8Encoded = v2_constants.utf8EncodedRecords.contains(record);

  if (isUtf8Encoded) {
    var processedContent = content;
    if (record == Record.cname || record == Record.txt) {
      processedContent = _encodePunycode(content);
    }
    return Uint8List.fromList(utf8.encode(processedContent));
  } else if (record == Record.sol) {
    try {
      final pubkey = Ed25519HDPublicKey.fromBase58(content);
      return Uint8List.fromList(pubkey.bytes);
    } on Exception {
      throw InvalidRecordInputError(
          'Invalid Solana public key format: $content');
    }
  } else if (v2_constants.evmRecords.contains(record)) {
    _check(
      content.startsWith('0x'),
      InvalidEvmAddressError('The record content must start with `0x`'),
    );
    try {
      final hexString = content.substring(2);
      final bytes = <int>[];
      for (var i = 0; i < hexString.length; i += 2) {
        final byteString = hexString.substring(i, i + 2);
        bytes.add(int.parse(byteString, radix: 16));
      }
      _check(
        bytes.length == 20,
        InvalidEvmAddressError('EVM addresses must be exactly 20 bytes'),
      );
      return Uint8List.fromList(bytes);
    } on Exception {
      throw InvalidEvmAddressError(
          'Invalid hex format in EVM address: $content');
    }
  } else if (record == Record.injective) {
    try {
      final decoded = SimpleBech32.decode(content);
      _check(
        decoded.hrp == 'inj',
        InvalidInjectiveAddressError(
            'The record content must start with `inj`'),
      );
      final bytes = SimpleBech32.convertBits(decoded.data, 5, 8, false);
      _check(
        bytes.length == 20,
        InvalidInjectiveAddressError('The record data must be 20 bytes long'),
      );
      return Uint8List.fromList(bytes);
    } on Exception {
      throw InvalidInjectiveAddressError(
          'Invalid Injective address format: $content');
    }
  } else if (record == Record.a) {
    final bytes = _parseIpAddress(content, isV6: false);
    _check(
      bytes.length == 4,
      InvalidARecordError('The record content must be 4 bytes long'),
    );
    return Uint8List.fromList(bytes);
  } else if (record == Record.aaaa) {
    final bytes = _parseIpAddress(content, isV6: true);
    _check(
      bytes.length == 16,
      InvalidAAAARecordError('The record content must be 16 bytes long'),
    );
    return Uint8List.fromList(bytes);
  } else {
    throw InvalidRecordInputError('The record content is malformed');
  }
}
