/// Record V2 key derivation functionality
///
/// This module provides functionality to derive public keys for Record V2 accounts,
/// mirroring the JavaScript SDK implementation exactly.
library;

import '../constants/addresses.dart';
import '../constants/records.dart';
import '../utils/get_domain_key_sync.dart';

/// Derives a record V2 key for the given domain and record type
///
/// This function creates the public key for a Record V2 account by:
/// 1. Getting the domain key for the specified domain
/// 2. Hashing the record name with the V2 prefix (\x02)
/// 3. Deriving the final record account key using the central state
///
/// Examples:
/// ```dart
/// final key = getRecordV2Key('example.sol', Record.email);
/// final solKey = getRecordV2Key('mydomain', Record.sol);
/// ```
///
/// @param domain The .sol domain name (with or without .sol suffix)
/// @param record The record type to derive the key for
/// @returns Public key of the record V2 account as base58 string
Future<String> getRecordV2Key(String domain, Record record) async {
  final domainResult = await getDomainKeySync(domain);
  final hashedName = getHashedNameSync('\x02${record.value}');

  return getNameAccountKeySync(
    hashedName,
    nameClass: centralStateDomainRecords,
    nameParent: domainResult.pubkey,
  );
}
