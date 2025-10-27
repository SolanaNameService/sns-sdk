/// Synchronous domain key derivation utilities
///
/// This module provides synchronous functions for deriving domain keys,
/// mirroring the functionality from the JavaScript SDK exactly.
library;

import 'dart:convert';
import 'dart:typed_data';
import 'package:crypto/crypto.dart';
import 'package:solana/solana.dart';

import '../constants/addresses.dart';
import '../constants/records.dart';
import 'base58_utils.dart';

/// Hash prefix used to derive domain name addresses
const String hashPrefix = 'SPL Name Service';

/// Maximum seed length for PDA derivation
const int maxSeedLength = 32;

/// PDA marker bytes
const String pdaMarker = 'ProgramDerivedAddress';

/// Result of domain key derivation
class DomainKeyResult {
  const DomainKeyResult({
    required this.pubkey,
    required this.hashed,
    required this.isSub,
    this.parent,
  });

  /// The derived public key
  final String pubkey;

  /// The hashed name
  final Uint8List hashed;

  /// Whether this is a subdomain
  final bool isSub;

  /// The parent key (if applicable)
  final String? parent;
}

/// Generates a hash of a name with the SNS prefix
///
/// @param name The name to hash
/// @returns The SHA-256 hash as bytes
Uint8List getHashedNameSync(String name) {
  final input = hashPrefix + name;
  final hash = sha256.convert(utf8.encode(input));
  return Uint8List.fromList(hash.bytes);
}

/// Derives a name account key from a hashed name
///
/// This function uses the Espresso Cash Solana package for proper PDA derivation
/// to ensure exact compatibility with JavaScript/Solana behavior
///
/// @param hashedName The SHA-256 hash of the name
/// @param nameClass Optional class key for records
/// @param nameParent Parent domain key
/// @returns The derived public key as base58 string
Future<String> getNameAccountKeySync(
  Uint8List hashedName, {
  String? nameClass,
  String? nameParent,
}) async {
  final seeds = <List<int>>[hashedName];

  // Add class address or 32 zero bytes
  if (nameClass != null) {
    seeds.add(Base58Utils.decode(nameClass));
  } else {
    seeds.add(List.filled(32, 0));
  }

  // Add parent address or 32 zero bytes
  if (nameParent != null) {
    seeds.add(Base58Utils.decode(nameParent));
  } else {
    seeds.add(List.filled(32, 0));
  }

  // Use Espresso Cash Solana package for proper PDA derivation
  final programId = Ed25519HDPublicKey.fromBase58(nameProgramAddress);
  final result = await Ed25519HDPublicKey.findProgramAddress(
    seeds: seeds,
    programId: programId,
  );

  return result.toBase58();
}

/// Internal function to derive a key synchronously
Future<DomainKeyResult> _deriveSync(
  String name, {
  String parent = rootDomainAddress,
  String? classKey,
}) async {
  final hashed = getHashedNameSync(name);
  final pubkey = await getNameAccountKeySync(
    hashed,
    nameClass: classKey,
    nameParent: parent,
  );

  return DomainKeyResult(
    pubkey: pubkey,
    hashed: hashed,
    isSub: false,
  );
}

/// Computes the public key of a domain or subdomain
///
/// This function mirrors the JavaScript SDK exactly and can handle:
/// - Root domains (e.g., 'bonfida.sol')
/// - Subdomains (e.g., 'dex.bonfida.sol')
/// - Records (e.g., 'twitter.bonfida.sol')
/// - Sub-records (e.g., 'twitter.dex.bonfida.sol')
///
/// @param domain The domain to compute the public key for
/// @param record Optional parameter: If the domain being resolved is a record
/// @returns [DomainKeyResult] containing the derived key and metadata
Future<DomainKeyResult> getDomainKeySync(String domain,
    [RecordVersion? record]) async {
  // Remove .sol suffix if present
  if (domain.endsWith('.sol')) {
    domain = domain.substring(0, domain.length - 4);
  }

  final recordClass =
      record == RecordVersion.v2 ? centralStateDomainRecords : null;
  final splitted = domain.split('.');

  if (splitted.length == 2) {
    // Subdomain case: "sub.domain" or "record.domain"
    // Match JavaScript: Buffer.from([record ? record : 0]).toString()
    final prefixCode = record?.value ?? 0;
    final prefix = String.fromCharCode(prefixCode);
    final sub = prefix + splitted[0];
    final parentResult = await _deriveSync(splitted[1]);
    final result = await _deriveSync(sub,
        parent: parentResult.pubkey, classKey: recordClass);

    return DomainKeyResult(
      pubkey: result.pubkey,
      hashed: result.hashed,
      isSub: true,
      parent: parentResult.pubkey,
    );
  } else if (splitted.length == 3 && record != null) {
    // Sub-record case: "record.sub.domain"
    // Parent key
    final parentResult = await _deriveSync(splitted[2]);
    // Sub domain
    final subResult =
        await _deriveSync('\u0000${splitted[1]}', parent: parentResult.pubkey);
    // Sub record
    final recordPrefix = record == RecordVersion.v2 ? '\u0002' : '\u0001';
    final result = await _deriveSync(
      recordPrefix + splitted[0],
      parent: subResult.pubkey,
      classKey: recordClass,
    );

    return DomainKeyResult(
      pubkey: result.pubkey,
      hashed: result.hashed,
      isSub: true,
      parent: subResult.pubkey,
    );
  } else if (splitted.length >= 3) {
    // Match JavaScript: throw error for splitted.length >= 3 (without record)
    throw ArgumentError('The domain is malformed');
  } else {
    // Regular domain case: "domain"
    final result = await _deriveSync(domain);
    return DomainKeyResult(
      pubkey: result.pubkey,
      hashed: result.hashed,
      isSub: false,
    );
  }
}
