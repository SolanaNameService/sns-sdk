/// Synchronous record key derivation for SNS domains
///
/// This module provides functions to derive record keys for SNS domains,
/// mirroring the functionality from the JavaScript SDK exactly.
library;

import '../constants/records.dart';
import '../utils/get_domain_key_sync.dart';

/// Derives a record key for a given domain and record type
///
/// This function computes the public key for a specific record type
/// associated with a domain. It follows the SNS naming convention where
/// records are stored as subdomains with the record type as prefix.
///
/// Example:
/// ```dart
/// // Get the key for twitter record of 'example.sol'
/// final key = getRecordKeySync('example', Record.twitter);
/// ```
///
/// @param domain The .sol domain name (without the .sol suffix)
/// @param record The record type to derive the key for
/// @returns The derived public key as a base58 string
Future<String> getRecordKeySync(String domain, Record record) async {
  final recordDomain = '${record.value}.$domain';
  final result = await getDomainKeySync(recordDomain, RecordVersion.v1);
  return result.pubkey;
}

/// Gets the record key for a specific record type and domain
/// Returns both the key and additional metadata
///
/// @param domain The .sol domain name (without the .sol suffix)
/// @param record The record type to derive the key for
/// @returns [DomainKeyResult] containing pubkey, hash, and subdomain info
Future<DomainKeyResult> getRecordKeyWithMetadata(
    String domain, Record record) async {
  final recordDomain = '${record.value}.$domain';
  return getDomainKeySync(recordDomain, RecordVersion.v1);
}
