import 'dart:convert';
import 'dart:typed_data';

import 'package:crypto/crypto.dart';
import 'package:solana/solana.dart';

import '../constants/addresses.dart';
import 'base58_utils.dart';

/// Hash prefix used by the SNS system
const String _hashPrefix = 'SPL Name Service';

/// Generates a SHA-256 hash of a string with the SNS prefix.
///
/// @param str The string to be hashed
/// @returns SHA-256 hash as bytes
Future<Uint8List> generateHash(String str) async {
  final data = utf8.encode(_hashPrefix + str);
  final hash = sha256.convert(data);
  return Uint8List.fromList(hash.bytes);
}

/// Derives an address from a hash with optional parent and class addresses.
///
/// @param hash The hash to derive the address from
/// @param parentAddress Optional parent address (32 bytes, defaults to zero)
/// @param classAddress Optional class address (32 bytes, defaults to zero)
/// @returns The derived address as a base58 string
Future<String> getAddressFromHash(
  Uint8List hash, {
  String? parentAddress,
  String? classAddress,
}) async {
  final seeds = <List<int>>[];

  // Add the hash
  seeds.add(hash);

  // Add class address (or 32 zero bytes)
  if (classAddress != null) {
    seeds.add(_base58Decode(classAddress));
  } else {
    seeds.add(List.filled(32, 0));
  }

  // Add parent address (or 32 zero bytes)
  if (parentAddress != null) {
    seeds.add(_base58Decode(parentAddress));
  } else {
    seeds.add(List.filled(32, 0));
  }

  // Generate PDA with NAME_PROGRAM_ADDRESS
  return _getProgramDerivedAddress(
    seeds: seeds,
    programId: nameProgramAddress,
  );
}

/// Derives an address from an input string with optional parent and class addresses.
///
/// This mirrors the main `deriveAddress` function from js-kit/src/utils/deriveAddress.ts
///
/// [str] - The input string to derive the address from
/// [parentAddress] - Optional parent address
/// [classAddress] - Optional class address
///
/// Returns the derived address as a base58 string
Future<String> deriveAddress(
  String str, {
  String? parentAddress,
  String? classAddress,
}) async {
  final hash = await generateHash(str);
  return getAddressFromHash(
    hash,
    parentAddress: parentAddress,
    classAddress: classAddress,
  );
}

/// Generates a Program Derived Address (PDA) using the official Solana implementation.
///
/// This uses the proven Ed25519HDPublicKey.findProgramAddress from the solana package
/// to ensure 100% compatibility with the official Solana SDK.
///
/// [seeds] - List of seed byte arrays
/// [programId] - The program ID as a base58 string
///
/// Returns the PDA as a base58 string
Future<String> _getProgramDerivedAddress({
  required List<List<int>> seeds,
  required String programId,
}) async {
  // Convert to the format expected by the solana package
  final programKey = Ed25519HDPublicKey.fromBase58(programId);

  // Use the official Solana PDA generation
  final result = await Ed25519HDPublicKey.findProgramAddress(
    seeds: seeds,
    programId: programKey,
  );

  return result.toBase58();
}

/// Decodes a base58 string to bytes using shared utility
List<int> _base58Decode(String input) => Base58Utils.decode(input);
