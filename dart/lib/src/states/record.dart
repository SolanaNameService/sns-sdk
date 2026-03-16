import 'dart:typed_data';

import '../errors/sns_errors.dart';
import '../rpc/rpc_client.dart';
import '../types/validation.dart';

/// Length of name registry data
const int nameRegistryLength = 96;

/// Get validation length based on validation type
int getValidationLength(Validation validation) {
  switch (validation) {
    case Validation.none:
      return 0;
    case Validation.ethereum:
      return 20;
    case Validation.solana:
      return 32;
    case Validation.unverifiedSolana:
      return 32;
  }
}

/// Record header state containing metadata
class RecordHeaderState {
  const RecordHeaderState({
    required this.stalenessValidation,
    required this.rightOfAssociationValidation,
    required this.contentLength,
  });

  /// Staleness validation type
  final int stalenessValidation;

  /// Right of association validation type
  final int rightOfAssociationValidation;

  /// Content length
  final int contentLength;

  /// Length of the header struct
  static const int length = 8;

  /// Deserialize record header from data
  static RecordHeaderState deserialize(Uint8List data) {
    if (data.length < length) {
      throw ArgumentError('Insufficient data for RecordHeaderState');
    }

    final byteData = ByteData.sublistView(data);

    return RecordHeaderState(
      stalenessValidation: byteData.getUint16(0, Endian.little),
      rightOfAssociationValidation: byteData.getUint16(2, Endian.little),
      contentLength: byteData.getUint32(4, Endian.little),
    );
  }

  /// Retrieve record header from RPC
  static Future<RecordHeaderState> retrieve(
      RpcClient rpc, String address) async {
    final recordHeaderAccount = await rpc.fetchEncodedAccount(address);

    if (!recordHeaderAccount.exists) {
      throw StateError('Record header account not found');
    }

    final headerData = recordHeaderAccount.data.sublist(
      nameRegistryLength,
      nameRegistryLength + length,
    );

    return deserialize(Uint8List.fromList(headerData));
  }
}

/// Record state containing header and data
class RecordState {
  const RecordState({
    required this.header,
    required this.data,
  });

  /// Record header
  final RecordHeaderState header;

  /// Record data
  final Uint8List data;

  /// Deserialize record state from data
  static RecordState deserialize(Uint8List data) {
    const offset = nameRegistryLength;
    final header = RecordHeaderState.deserialize(
      data.sublist(offset, offset + RecordHeaderState.length),
    );

    return RecordState(
      header: header,
      data: data.sublist(offset + RecordHeaderState.length),
    );
  }

  /// Retrieve record state from RPC
  static Future<RecordState> retrieve(RpcClient rpc, String address) async {
    final recordAccount = await rpc.fetchEncodedAccount(address);

    if (!recordAccount.exists) {
      throw NoRecordDataError('Record account not found');
    }

    return deserialize(Uint8List.fromList(recordAccount.data));
  }

  /// Retrieve multiple record states from RPC
  static Future<List<RecordState?>> retrieveBatch(
    RpcClient rpc,
    List<String> addresses,
  ) async {
    final recordAccounts = await rpc.fetchEncodedAccounts(addresses);

    return recordAccounts
        .map((account) => account.exists
            ? deserialize(Uint8List.fromList(account.data))
            : null)
        .toList();
  }

  /// Get record content
  Uint8List getContent() {
    try {
      final startOffset = getValidationLength(
              Validation.fromValue(header.stalenessValidation)) +
          getValidationLength(
              Validation.fromValue(header.rightOfAssociationValidation));

      return data.sublist(startOffset);
    } on Exception {
      // If validation values are invalid, return empty content
      return Uint8List(0);
    }
  }

  /// Get staleness ID
  Uint8List getStalenessId() {
    try {
      final endOffset =
          getValidationLength(Validation.fromValue(header.stalenessValidation));

      return data.sublist(0, endOffset);
    } on Exception {
      // If validation value is invalid, return empty ID
      return Uint8List(0);
    }
  }

  /// Get right of association ID
  Uint8List getRoAId() {
    try {
      final startOffset =
          getValidationLength(Validation.fromValue(header.stalenessValidation));
      final endOffset = startOffset +
          getValidationLength(
              Validation.fromValue(header.rightOfAssociationValidation));

      return data.sublist(startOffset, endOffset);
    } on Exception {
      // If validation values are invalid, return empty ID
      return Uint8List(0);
    }
  }
}
