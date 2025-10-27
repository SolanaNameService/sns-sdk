import 'dart:convert';
import 'dart:typed_data';

import 'instruction_types.dart';

/// Parameters for creating an update record instruction
class UpdateRecordInstructionParams {
  const UpdateRecordInstructionParams({
    required this.record,
    required this.content,
    required this.systemProgram,
    required this.splNameServiceProgram,
    required this.feePayer,
    required this.recordAddress,
    required this.domain,
    required this.domainOwner,
    required this.centralState,
    required this.programAddress,
  });

  /// The record name to update
  final String record;

  /// The content to update
  final Uint8List content;

  /// The system program address
  final String systemProgram;

  /// The SPL name service program address
  final String splNameServiceProgram;

  /// The fee payer address
  final String feePayer;

  /// The record address
  final String recordAddress;

  /// The domain address
  final String domain;

  /// The domain owner address
  final String domainOwner;

  /// The central state address
  final String centralState;

  /// The program address
  final String programAddress;
}

/// Update record instruction for updating domain records
///
/// This mirrors js-kit/src/instructions/updateRecordInstruction.ts
class UpdateRecordInstruction extends SnsInstruction {
  UpdateRecordInstruction({
    required this.record,
    required this.content,
    required this.params,
  });

  /// Instruction tag
  final int tag = 2;

  /// The record name to update
  final String record;

  /// The content to update
  final Uint8List content;

  /// All parameters needed for instruction creation
  final UpdateRecordInstructionParams params;

  @override
  Uint8List serialize() {
    // Serialize: tag (1 byte) + record (string) + content (array)
    final recordBytes = utf8.encode(record);
    final recordLength = recordBytes.length;

    // Calculate total size: tag + record_length + record + content_length + content
    final totalSize = 1 + 4 + recordLength + 4 + content.length;
    final result = Uint8List(totalSize);

    var offset = 0;

    // Write tag
    result[offset] = tag;
    offset += 1;

    // Write record string length (little-endian)
    _writeLittleEndian32(result, offset, recordLength);
    offset += 4;

    // Write record string
    result.setRange(offset, offset + recordLength, recordBytes);
    offset += recordLength;

    // Write content array length (little-endian)
    _writeLittleEndian32(result, offset, content.length);
    offset += 4;

    // Write content array
    result.setRange(offset, offset + content.length, content);

    return result;
  }

  @override
  TransactionInstruction build() {
    final data = serialize();

    final accounts = <AccountMeta>[
      AccountMeta(
        address: params.systemProgram,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: params.splNameServiceProgram,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: params.feePayer,
        role: AccountRole.writableSigner,
      ),
      AccountMeta(
        address: params.recordAddress,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: params.domain,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: params.domainOwner,
        role: AccountRole.writableSigner,
      ),
      AccountMeta(
        address: params.centralState,
        role: AccountRole.readonly,
      ),
    ];

    return TransactionInstruction(
      programAddress: params.programAddress,
      accounts: accounts,
      data: data,
    );
  }

  /// Helper to write 32-bit little-endian integer
  void _writeLittleEndian32(Uint8List buffer, int offset, int value) {
    buffer[offset] = value & 0xFF;
    buffer[offset + 1] = (value >> 8) & 0xFF;
    buffer[offset + 2] = (value >> 16) & 0xFF;
    buffer[offset + 3] = (value >> 24) & 0xFF;
  }
}
