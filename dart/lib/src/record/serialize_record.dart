/// Record serialization functionality for SNS domains
///
/// This module provides functions to serialize user input strings into buffers
/// that will be stored in record account data, mirroring the JavaScript SDK exactly.
library;

import 'dart:convert';
import 'dart:typed_data';

import '../constants/records.dart';
import '../errors/sns_errors.dart';
import '../utils/base58_utils.dart';
import '../utils/bech32_utils.dart';

/// Serializes a user input string into a buffer for record account data
///
/// This function converts user input into the appropriate binary format
/// for storage in SNS record accounts. Different record types have different
/// serialization formats.
///
/// For serializing SOL records use `serializeSolRecord`
///
/// @param str The string being serialized into the record account data
/// @param record The record enum being serialized
/// @returns Uint8List buffer containing the serialized data
/// @throws [UnsupportedRecordError] for SOL records (use serializeSolRecord)
/// @throws [InvalidEvmAddressError] for invalid ETH/BSC addresses
/// @throws [InvalidInjectiveAddressError] for invalid Injective addresses
/// @throws [InvalidARecordError] for invalid IPv4 addresses
/// @throws [InvalidAAAARecordError] for invalid IPv6 addresses
/// @throws [InvalidRecordInputError] for other invalid record data
Uint8List serializeRecord(String str, Record record) {
  final recordSize = _getRecordSize(record);

  // Handle dynamic size records (strings)
  if (recordSize == null) {
    if (record == Record.cname || record == Record.txt) {
      str = _encodePunycode(str);
    }
    return Uint8List.fromList(utf8.encode(str));
  }

  if (record == Record.sol) {
    throw UnsupportedRecordError('Use `serializeSolRecord` for SOL record');
  } else if (record == Record.eth || record == Record.bsc) {
    if (!str.startsWith('0x')) {
      throw InvalidEvmAddressError('The record content must start with `0x`');
    }
    final hex = str.substring(2);
    if (hex.length != 40) {
      throw InvalidEvmAddressError('ETH/BSC address must be 40 hex characters');
    }
    return _hexToBytes(hex);
  } else if (record == Record.injective) {
    if (!str.startsWith('inj')) {
      throw InvalidInjectiveAddressError('Invalid Injective address');
    }

    // Use proper bech32 decoding like JavaScript implementation
    final decoded = SimpleBech32.decode(str);
    final result = Uint8List.fromList(decoded.data);
    if (result.length != 20) {
      throw InvalidInjectiveAddressError('Invalid Injective address length');
    }
    return result;
  } else if (record == Record.a) {
    final bytes = _parseIPv4(str);
    if (bytes.length != 4) {
      throw InvalidARecordError('The record content must be 4 bytes long');
    }
    return bytes;
  } else if (record == Record.aaaa) {
    final bytes = _parseIPv6(str);
    if (bytes.length != 16) {
      throw InvalidAAAARecordError('The record content must be 16 bytes long');
    }
    return bytes;
  } else if (record == Record.background) {
    try {
      return Uint8List.fromList(Base58Utils.decode(str));
    } on Exception catch (e) {
      throw InvalidRecordInputError('Invalid background public key: $e');
    }
  } else if (record == Record.btc ||
      record == Record.ltc ||
      record == Record.doge) {
    try {
      return Uint8List.fromList(Base58Utils.decode(str));
    } on Exception catch (e) {
      throw InvalidRecordInputError('Invalid cryptocurrency address: $e');
    }
  } else if (record == Record.ipfs || record == Record.arwv) {
    try {
      return Uint8List.fromList(Base58Utils.decode(str));
    } on Exception catch (e) {
      throw InvalidRecordInputError('Invalid hash format: $e');
    }
  }

  throw InvalidRecordInputError('The provided record data is invalid');
}

/// Serializes a SOL record with signature validation
///
/// SOL records require special handling with signature verification.
/// This function will be implemented when the full SOL record validation
/// system is added.
///
/// @param str The Solana address to serialize
/// @param recordKey The record public key
/// @param owner The record owner
/// @returns Uint8List buffer containing the serialized SOL record
/// @throws [InvalidRecordInputError] for invalid Solana addresses
Uint8List serializeSolRecord(String str, String recordKey, String owner) {
  try {
    final addressBytes = Base58Utils.decode(str);
    if (addressBytes.length != 32) {
      throw InvalidRecordInputError('Solana address must be 32 bytes');
    }

    // For now, return just the address bytes
    // Full implementation would include signature generation
    return Uint8List.fromList(addressBytes);
  } on Exception catch (e) {
    throw InvalidRecordInputError('Invalid Solana address: $e');
  }
}

/// Get the expected size for a record type (V1 records)
/// Returns null if size is dynamic or unknown
int? _getRecordSize(Record record) {
  const recordSizes = <Record, int>{
    Record.sol: 32, // Solana public key
    Record.eth: 20, // Ethereum address
    Record.btc: 25, // Bitcoin address (max)
    Record.ltc: 25, // Litecoin address (max)
    Record.doge: 25, // Dogecoin address (max)
    Record.bsc: 20, // BSC address (same as ETH)
    Record.injective: 20, // Injective address
    Record.ipfs: 46, // IPFS hash (CIDv0)
    Record.arwv: 43, // Arweave transaction ID
    Record.shdw: 44, // Shadow token
    Record.point: 32, // Point token
    Record.a: 4, // IPv4 address
    Record.aaaa: 16, // IPv6 address
    Record.background: 32, // Background image (public key)
  };

  return recordSizes[record];
}

/// Converts hex string to bytes
Uint8List _hexToBytes(String hex) {
  if (hex.length % 2 != 0) {
    throw ArgumentError('Hex string must have even length');
  }

  final bytes = <int>[];
  for (var i = 0; i < hex.length; i += 2) {
    final byte = int.parse(hex.substring(i, i + 2), radix: 16);
    bytes.add(byte);
  }
  return Uint8List.fromList(bytes);
}

/// Parses an IPv4 address string to bytes
Uint8List _parseIPv4(String address) {
  final parts = address.split('.');
  if (parts.length != 4) {
    throw InvalidARecordError('IPv4 address must have 4 parts');
  }

  final bytes = <int>[];
  for (final part in parts) {
    final num = int.tryParse(part);
    if (num == null || num < 0 || num > 255) {
      throw InvalidARecordError('IPv4 parts must be 0-255');
    }
    bytes.add(num);
  }
  return Uint8List.fromList(bytes);
}

/// Parses an IPv6 address string to bytes
Uint8List _parseIPv6(String address) {
  // Handle IPv6 compression (::) notation
  if (address.contains('::')) {
    // Split on '::'
    final parts = address.split('::');
    if (parts.length > 2) {
      throw InvalidAAAARecordError('Invalid IPv6 address: multiple "::"');
    }

    final left = parts[0].isEmpty ? <String>[] : parts[0].split(':');
    final right = parts.length > 1 && parts[1].isNotEmpty
        ? parts[1].split(':')
        : <String>[];

    // Calculate how many zero groups need to be inserted
    const totalGroups = 8;
    final missingGroups = totalGroups - left.length - right.length;

    if (missingGroups < 0) {
      throw InvalidAAAARecordError('Invalid IPv6 address: too many groups');
    }

    // Rebuild the full address
    final fullParts = <String>[];
    fullParts.addAll(left);
    for (var i = 0; i < missingGroups; i++) {
      fullParts.add('0');
    }
    fullParts.addAll(right);

    address = fullParts.join(':');
  }

  // Parse the full IPv6 address
  final parts = address.split(':');
  if (parts.length != 8) {
    throw InvalidAAAARecordError(
        'IPv6 address must have 8 parts (expanded form)');
  }

  final bytes = <int>[];
  for (final part in parts) {
    if (part.length > 4) {
      throw InvalidAAAARecordError('IPv6 parts must be max 4 hex digits');
    }
    final value = int.tryParse(part.isEmpty ? '0' : part, radix: 16);
    if (value == null) {
      throw InvalidAAAARecordError('Invalid hex in IPv6 address');
    }
    // Add high byte then low byte
    bytes.add((value >> 8) & 0xFF);
    bytes.add(value & 0xFF);
  }
  return Uint8List.fromList(bytes);
}

/// Encodes a string with punycode following RFC 3492
String _encodePunycode(String input) {
  // Check if encoding is needed (contains non-ASCII)
  if (input.codeUnits.every((c) => c < 128)) {
    return input;
  }

  const base = 36;
  const tMin = 1;
  const tMax = 26;
  const initialBias = 72;
  const initialN = 128;

  final output = <int>[];
  var n = initialN;
  var delta = 0;
  var bias = initialBias;

  // Extract ASCII characters
  final basicChars = input.codeUnits.where((c) => c < 128).toList();
  output.addAll(basicChars);

  final basicLength = basicChars.length;
  var handledCodePoints = basicLength;

  if (basicLength > 0) {
    output.add(45); // '-' separator
  }

  final inputCodePoints = input.runes.toList();
  final inputLength = inputCodePoints.length;

  while (handledCodePoints < inputLength) {
    // Find the next code point to handle
    var minCodePoint = 0x110000; // Max Unicode code point + 1
    for (final codePoint in inputCodePoints) {
      if (codePoint >= n && codePoint < minCodePoint) {
        minCodePoint = codePoint;
      }
    }

    // Increase delta by the number of code points we're skipping
    delta += (minCodePoint - n) * (handledCodePoints + 1);
    n = minCodePoint;

    for (final codePoint in inputCodePoints) {
      if (codePoint < n) {
        delta++;
      } else if (codePoint == n) {
        // Encode this code point
        var q = delta;

        for (var k = base;; k += base) {
          final t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
          if (q < t) break;

          final digit = t + (q - t) % (base - t);
          output.add(digit < 26 ? digit + 97 : digit - 26 + 48); // a-z or 0-9
          q = (q - t) ~/ (base - t);
        }

        output.add(q < 26 ? q + 97 : q - 26 + 48); // a-z or 0-9
        bias = _adaptBias(
            delta, handledCodePoints + 1, handledCodePoints == basicLength);
        delta = 0;
        handledCodePoints++;
      }
    }

    delta++;
    n++;
  }

  return 'xn--${String.fromCharCodes(output)}';
}

/// Adapt the bias for punycode encoding
int _adaptBias(int delta, int numPoints, bool firstTime) {
  const base = 36;
  const tMin = 1;
  const tMax = 26;
  const skew = 38;
  const damp = 700;

  delta = firstTime ? delta ~/ damp : delta ~/ 2;
  delta += delta ~/ numPoints;

  var k = 0;
  while (delta > ((base - tMin) * tMax) ~/ 2) {
    delta ~/= base - tMin;
    k += base;
  }

  return k + (((base - tMin + 1) * delta) ~/ (delta + skew));
}
