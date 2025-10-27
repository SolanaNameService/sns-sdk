/// Record type definitions for the SNS SDK.
library;

import '../constants/records.dart';

/// Record result containing the content and validation metadata.
class RecordResult {
  /// Creates a record result.
  const RecordResult({
    required this.content,
    required this.stale,
    this.rightOfAssociation,
    this.header,
  });

  /// Raw record content as bytes.
  final List<int> content;

  /// Whether the record is stale (expired or ownership changed).
  final bool stale;

  /// Right-of-Association validation result.
  final String? rightOfAssociation;

  /// Record header with metadata.
  final RecordHeader? header;

  RecordResult copyWith({
    List<int>? content,
    bool? stale,
    String? rightOfAssociation,
    RecordHeader? header,
  }) =>
      RecordResult(
        content: content ?? this.content,
        stale: stale ?? this.stale,
        rightOfAssociation: rightOfAssociation ?? this.rightOfAssociation,
        header: header ?? this.header,
      );

  @override
  String toString() =>
      'RecordResult(content: ${content.length} bytes, stale: $stale, '
      'rightOfAssociation: $rightOfAssociation, header: $header)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is RecordResult &&
        _listEquals(other.content, content) &&
        other.stale == stale &&
        other.rightOfAssociation == rightOfAssociation &&
        other.header == header;
  }

  @override
  int get hashCode => Object.hash(
        Object.hashAll(content),
        stale,
        rightOfAssociation,
        header,
      );
}

/// Record header containing metadata
class RecordHeader {
  const RecordHeader({
    required this.stalenessId,
    required this.contentHash,
  });
  final int stalenessId;
  final int contentHash;

  RecordHeader copyWith({
    int? stalenessId,
    int? contentHash,
  }) =>
      RecordHeader(
        stalenessId: stalenessId ?? this.stalenessId,
        contentHash: contentHash ?? this.contentHash,
      );

  @override
  String toString() =>
      'RecordHeader(stalenessId: $stalenessId, contentHash: $contentHash)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is RecordHeader &&
        other.stalenessId == stalenessId &&
        other.contentHash == contentHash;
  }

  @override
  int get hashCode => Object.hash(stalenessId, contentHash);
}

/// Abstract base class for record content
abstract class RecordContent {
  /// Serialize the record content to bytes
  List<int> serialize();

  /// Get the record type
  Record get recordType;

  /// Deserialize record content from bytes
  static RecordContent deserialize(Record type, List<int> data) {
    switch (type) {
      case Record.sol:
        return SolRecordContent.fromBytes(data);
      case Record.eth:
      case Record.bsc:
      case Record.injective:
        return EvmRecordContent.fromBytes(data, type);
      case Record.btc:
      case Record.ltc:
      case Record.doge:
        return CryptoRecordContent.fromBytes(data, type);
      case Record.url:
      case Record.email:
      case Record.discord:
      case Record.github:
      case Record.reddit:
      case Record.twitter:
      case Record.telegram:
        return StringRecordContent.fromBytes(data, type);
      case Record.ipfs:
      case Record.arwv:
      case Record.shdw:
        return HashRecordContent.fromBytes(data, type);
      default:
        return RawRecordContent.fromBytes(data, type);
    }
  }
}

/// SOL address record content
class SolRecordContent extends RecordContent {
  SolRecordContent(this.address);
  final String address;

  @override
  Record get recordType => Record.sol;

  @override
  List<int> serialize() {
    // Implementation for SOL address serialization
    // This would involve base58 decoding and padding
    throw UnsupportedError('SOL record serialization not yet implemented');
  }

  static SolRecordContent fromBytes(List<int> data) {
    // Implementation for SOL address deserialization
    throw UnsupportedError('SOL record deserialization not yet implemented');
  }

  @override
  String toString() => 'SolRecordContent(address: $address)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is SolRecordContent && other.address == address;
  }

  @override
  int get hashCode => address.hashCode;
}

/// EVM address record content (ETH, BSC, Injective)
class EvmRecordContent extends RecordContent {
  EvmRecordContent(this.address, this._type);
  final String address;
  final Record _type;

  @override
  Record get recordType => _type;

  @override
  List<int> serialize() {
    // Implementation for EVM address serialization
    throw UnsupportedError('EVM record serialization not yet implemented');
  }

  static EvmRecordContent fromBytes(List<int> data, Record type) {
    // Implementation for EVM address deserialization
    throw UnsupportedError('EVM record deserialization not yet implemented');
  }

  @override
  String toString() => 'EvmRecordContent(address: $address, type: $recordType)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is EvmRecordContent &&
        other.address == address &&
        other.recordType == recordType;
  }

  @override
  int get hashCode => Object.hash(address, recordType);
}

/// Cryptocurrency address record content
class CryptoRecordContent extends RecordContent {
  CryptoRecordContent(this.address, this._type);
  final String address;
  final Record _type;

  @override
  Record get recordType => _type;

  @override
  List<int> serialize() {
    // Implementation for crypto address serialization
    throw UnsupportedError('Crypto record serialization not yet implemented');
  }

  static CryptoRecordContent fromBytes(List<int> data, Record type) {
    // Implementation for crypto address deserialization
    throw UnsupportedError('Crypto record deserialization not yet implemented');
  }

  @override
  String toString() =>
      'CryptoRecordContent(address: $address, type: $recordType)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is CryptoRecordContent &&
        other.address == address &&
        other.recordType == recordType;
  }

  @override
  int get hashCode => Object.hash(address, recordType);
}

/// String-based record content
class StringRecordContent extends RecordContent {
  StringRecordContent(this.value, this._type);
  final String value;
  final Record _type;

  @override
  Record get recordType => _type;

  @override
  List<int> serialize() {
    // Implementation for string serialization
    throw UnsupportedError('String record serialization not yet implemented');
  }

  static StringRecordContent fromBytes(List<int> data, Record type) {
    // Implementation for string deserialization
    throw UnsupportedError('String record deserialization not yet implemented');
  }

  @override
  String toString() => 'StringRecordContent(value: $value, type: $recordType)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is StringRecordContent &&
        other.value == value &&
        other.recordType == recordType;
  }

  @override
  int get hashCode => Object.hash(value, recordType);
}

/// Hash-based record content (IPFS, Arweave, etc.)
class HashRecordContent extends RecordContent {
  HashRecordContent(this.hash, this._type);
  final String hash;
  final Record _type;

  @override
  Record get recordType => _type;

  @override
  List<int> serialize() {
    // Implementation for hash serialization
    throw UnsupportedError('Hash record serialization not yet implemented');
  }

  static HashRecordContent fromBytes(List<int> data, Record type) {
    // Implementation for hash deserialization
    throw UnsupportedError('Hash record deserialization not yet implemented');
  }

  @override
  String toString() => 'HashRecordContent(hash: $hash, type: $recordType)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is HashRecordContent &&
        other.hash == hash &&
        other.recordType == recordType;
  }

  @override
  int get hashCode => Object.hash(hash, recordType);
}

/// Raw bytes record content for unsupported types
class RawRecordContent extends RecordContent {
  RawRecordContent(this.data, this._type);
  final List<int> data;
  final Record _type;

  @override
  Record get recordType => _type;

  @override
  List<int> serialize() => List.from(data);

  static RawRecordContent fromBytes(List<int> data, Record type) =>
      RawRecordContent(List.from(data), type);

  @override
  String toString() =>
      'RawRecordContent(data: ${data.length} bytes, type: $recordType)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is RawRecordContent &&
        _listEquals(other.data, data) &&
        other.recordType == recordType;
  }

  @override
  int get hashCode => Object.hash(Object.hashAll(data), recordType);
}

/// Helper function to compare lists
bool _listEquals<T>(List<T> list1, List<T> list2) {
  if (list1.length != list2.length) return false;
  for (var i = 0; i < list1.length; i++) {
    if (list1[i] != list2[i]) return false;
  }
  return true;
}
