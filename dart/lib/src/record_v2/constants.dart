/// Constants for Record V2 operations
///
/// This module provides constants used in Record V2 operations including
/// guardians, record type sets, and validation constants.
library;

import '../constants/records.dart';

/// Guardian public keys for specific record types
///
/// Guardians are special authorities that can verify certain record types
const Map<Record, String> guardians = {
  Record.url: 'ExXjtfdQe8JacoqP9Z535WzQKjF4CzW1TTRKRgpxvya3',
  Record.cname: 'ExXjtfdQe8JacoqP9Z535WzQKjF4CzW1TTRKRgpxvya3',
};

/// Records that utilize secp256k1 for verification purposes
const Set<Record> ethRoaRecords = {
  Record.eth,
  Record.injective,
  Record.bsc,
  Record.base,
};

/// EVM-compatible record types that use hex addresses with 0x prefix
const Set<Record> evmRecords = {
  Record.eth,
  Record.bsc,
  Record.base,
};

/// Records that are UTF-8 encoded strings
const Set<Record> utf8EncodedRecords = {
  Record.ipfs,
  Record.arwv,
  Record.ltc,
  Record.doge,
  Record.email,
  Record.url,
  Record.discord,
  Record.github,
  Record.reddit,
  Record.twitter,
  Record.telegram,
  Record.pic,
  Record.shdw,
  Record.point,
  Record.backpack,
  Record.txt,
  Record.cname,
  Record.btc,
  Record.ipns,
};

/// Records that are self-signed (signed by the public key contained in the record itself)
const Set<Record> selfSignedRecords = {
  Record.eth,
  Record.injective,
  Record.sol,
};
