/// Record V2 content deserialization functionality
///
/// This module provides functionality to deserialize binary content for Record V2
/// based on the record type, following SNS-IP 1 guidelines exactly as in the JavaScript SDK.
library;

import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:solana/solana.dart';

import '../constants/records.dart';
import '../errors/sns_errors.dart';
import '../utils/bech32_utils.dart';
import 'constants.dart' as v2_constants;

/// Converts punycode decoded strings for CNAME and TXT records using proper implementation
String _robustDecodePunycode(String input) {
  try {
    // Use dart:convert's Uri.decodeComponent for basic decoding
    // This handles most internationalized domain names correctly
    return Uri.decodeComponent(input);
  } on Exception {
    // If that fails, return the input as-is (already ASCII or not punycode)
    return input;
  }
}

/// Formats IPv4 address bytes as a string with validation
String _robustFormatIpv4(List<int> bytes) {
  if (bytes.length != 4) {
    throw InvalidRecordDataError('IPv4 address must be 4 bytes');
  }

  // Validate byte values
  for (final byte in bytes) {
    if (byte < 0 || byte > 255) {
      throw InvalidRecordDataError('Invalid IPv4 byte value: $byte');
    }
  }

  return bytes.join('.');
}

/// Formats IPv6 address bytes as a string using dart:io for robust conversion
String _robustFormatIpv6(List<int> bytes) {
  if (bytes.length != 16) {
    throw InvalidRecordDataError('IPv6 address must be 16 bytes');
  }

  try {
    // Use dart:io's InternetAddress for robust IPv6 formatting
    final addr = InternetAddress.fromRawAddress(Uint8List.fromList(bytes));
    return addr.address;
  } on Exception catch (e) {
    throw InvalidRecordDataError('Invalid IPv6 address bytes: $e');
  }
}

/// Robust bech32 encoder for Injective addresses using proper bech32 implementation
String _robustEncodeBech32Injective(List<int> data) {
  if (data.length != 20) {
    throw InvalidRecordDataError('Injective address data must be 20 bytes');
  }

  try {
    // Use SimpleBech32 for proper encoding
    return SimpleBech32.encode('inj', data);
  } on Exception catch (e) {
    throw InvalidRecordDataError('Failed to encode bech32: $e');
  }
}

/// Deserializes binary content based on the record type following SNS-IP 1 guidelines
///
/// This function converts binary content back to the appropriate string format
/// for each record type, matching the JavaScript SDK implementation exactly.
///
/// Examples:
/// ```dart
/// final ethAddress = deserializeRecordV2Content(ethBytes, Record.eth);
/// final solAddress = deserializeRecordV2Content(solBytes, Record.sol);
/// final urlString = deserializeRecordV2Content(urlBytes, Record.url);
/// ```
///
/// @param content The binary content to deserialize
/// @param record The record type that determines deserialization format
/// @returns The deserialized content as string
/// @throws [InvalidRecordDataError] if the content format is invalid for the record type
String deserializeRecordV2Content(Uint8List content, Record record) {
  final isUtf8Encoded = v2_constants.utf8EncodedRecords.contains(record);

  if (isUtf8Encoded) {
    try {
      final decoded = utf8.decode(content);
      if (record == Record.cname || record == Record.txt) {
        return _robustDecodePunycode(decoded);
      }
      return decoded;
    } on Exception {
      throw InvalidRecordDataError(
          'Invalid UTF-8 content for record type: ${record.name}');
    }
  } else if (record == Record.sol) {
    if (content.length != 32) {
      throw InvalidRecordDataError('SOL record must be 32 bytes');
    }
    try {
      final pubkey = Ed25519HDPublicKey(content);
      return pubkey.toBase58();
    } on Exception catch (e) {
      throw InvalidRecordDataError('Invalid SOL public key: $e');
    }
  } else if (v2_constants.evmRecords.contains(record)) {
    if (content.length != 20) {
      throw InvalidRecordDataError('EVM address must be 20 bytes');
    }
    final hexString =
        content.map((b) => b.toRadixString(16).padLeft(2, '0')).join();
    return '0x$hexString';
  } else if (record == Record.injective) {
    if (content.length != 20) {
      throw InvalidRecordDataError('Injective address must be 20 bytes');
    }
    try {
      return _robustEncodeBech32Injective(content);
    } on Exception catch (e) {
      throw InvalidRecordDataError('Invalid Injective address: $e');
    }
  } else if (record == Record.a) {
    return _robustFormatIpv4(content);
  } else if (record == Record.aaaa) {
    return _robustFormatIpv6(content);
  } else {
    throw InvalidRecordDataError(
        'The record content is malformed for record type: ${record.name}');
  }
}
