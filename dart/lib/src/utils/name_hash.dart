// Copyright 2023-2025 Immadominion & SNS DAO Contributors
// SPDX-License-Identifier: MIT

import 'dart:convert';
import 'dart:typed_data';
import 'package:crypto/crypto.dart';

/// Calculate name hash for a domain name
///
/// This function calculates the hash of a domain name
/// following the same algorithm as the JS SDK.
///
/// @param name - Domain name to hash
/// @returns Uint8List hash
Future<Uint8List> nameHash(String name) async {
  // Remove .sol suffix if present
  final processedName = name.toLowerCase().endsWith('.sol')
      ? name.substring(0, name.length - 4).toLowerCase()
      : name.toLowerCase();

  // Special case for root domain
  if (processedName.isEmpty) {
    return Uint8List(32);
  }

  // Split domain into parts
  final labels = processedName.split('.');

  // Create a buffer for hashing
  final buffer = Uint8List(32 * labels.length);
  final byteData = ByteData.view(buffer.buffer);

  // Calculate hash for each part
  for (var i = 0; i < labels.length; i++) {
    final digest = sha256.convert(utf8.encode(labels[i]));
    final digestBytes = Uint8List.fromList(digest.bytes);
    byteData.buffer.asUint8List().setRange(i * 32, (i + 1) * 32, digestBytes);
  }

  // Calculate final hash
  final finalDigest = sha256.convert(buffer);
  return Uint8List.fromList(finalDigest.bytes);
}
