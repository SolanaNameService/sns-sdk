/// Record types and constants for the SNS SDK.
///
/// Defines all supported record types for Solana Name Service domains,
/// including cryptocurrency addresses, social media handles, and metadata.
library;

/// Enumeration of all supported SNS record types.
///
/// Records allow domains to store various types of information:
/// - Cryptocurrency addresses (SOL, ETH, BTC, etc.)
/// - Social media handles (Twitter, Discord, GitHub, etc.)
/// - Web resources (URL, IPFS, email)
/// - DNS records (A, AAAA)
enum Record {
  ipfs('IPFS'),
  arwv('ARWV'),
  sol('SOL'),
  eth('ETH'),
  btc('BTC'),
  ltc('LTC'),
  doge('DOGE'),
  email('email'),
  url('url'),
  discord('discord'),
  github('github'),
  reddit('reddit'),
  twitter('twitter'),
  telegram('telegram'),
  pic('pic'),
  shdw('SHDW'),
  point('POINT'),
  bsc('BSC'),
  injective('INJ'),
  backpack('backpack'),
  a('A'),
  aaaa('AAAA'),
  cname('CNAME'),
  txt('TXT'),
  background('background'),
  base('BASE'),
  ipns('IPNS');

  const Record(this.value);

  final String value;

  @override
  String toString() => value;
}

/// Record V1 sizes
const Map<Record, int> recordV1Size = {
  Record.sol: 96,
  Record.eth: 20,
  Record.bsc: 20,
  Record.injective: 20,
  Record.a: 4,
  Record.aaaa: 16,
  Record.background: 32,
};

/// Record version enumeration
enum RecordVersion {
  v1(1),
  v2(2);

  const RecordVersion(this.value);

  final int value;

  @override
  String toString() => 'v$value';
}

/// A map that associates each record type with a public key, known as guardians
const Map<Record, String> guardians = {
  Record.cname: 'ExXjtfdQe8JacoqP9Z535WzQKjF4CzW1TTRKRgpxvya3',
  Record.url: 'ExXjtfdQe8JacoqP9Z535WzQKjF4CzW1TTRKRgpxvya3',
};

/// Set of records that utilize secp256k1 for verification purposes
const Set<Record> ethRoaRecords = {
  Record.base,
  Record.bsc,
  Record.eth,
  Record.injective,
};

/// Set of records which correspond to eth addresses with the prefix 0x
const Set<Record> evmRecords = {
  Record.base,
  Record.bsc,
  Record.eth,
};

/// Set of records that are UTF-8 encoded strings
const Set<Record> utf8EncodedRecords = {
  Record.arwv,
  Record.backpack,
  Record.btc,
  Record.cname,
  Record.discord,
  Record.doge,
  Record.email,
  Record.github,
  Record.ipfs,
  Record.ipns,
  Record.ltc,
  Record.pic,
  Record.point,
  Record.reddit,
  Record.shdw,
  Record.telegram,
  Record.twitter,
  Record.txt,
  Record.url,
};

/// Set of records that are self signed i.e signed by the public key contained
/// in the record itself
const Set<Record> selfSignedRecords = {
  Record.base,
  Record.bsc,
  Record.eth,
  Record.injective,
  Record.sol,
};
