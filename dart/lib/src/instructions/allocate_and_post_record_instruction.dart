import 'dart:convert';
import 'dart:typed_data';

import 'instruction_types.dart';

/// Allocate and post record instruction for SNS records
///
/// This mirrors js-kit/src/instructions/allocateAndPostRecordInstruction.ts
class AllocateAndPostRecordInstruction extends SnsInstruction {
  AllocateAndPostRecordInstruction({
    required this.record,
    required this.content,
  });

  /// Instruction tag
  final int tag = 1;

  /// The record type name
  final String record;

  /// The record content data
  final Uint8List content;

  @override
  Uint8List serialize() {
    final recordBytes = utf8.encode(record);
    final recordLength = Uint8List(4);
    recordLength.buffer
        .asByteData()
        .setUint32(0, recordBytes.length, Endian.little);

    final contentLength = Uint8List(4);
    contentLength.buffer
        .asByteData()
        .setUint32(0, content.length, Endian.little);

    return Uint8List.fromList([
      tag,
      ...recordLength,
      ...recordBytes,
      ...contentLength,
      ...content,
    ]);
  }

  /// Parameters for building the instruction
  late final String programAddress;
  late final String systemProgram;
  late final String splNameServiceProgram;
  late final String payer;
  late final String recordAddress;
  late final String domainAddress;
  late final String domainOwner;
  late final String centralState;

  /// Set parameters for building the instruction
  void setParams({
    required String programAddress,
    required String systemProgram,
    required String splNameServiceProgram,
    required String payer,
    required String recordAddress,
    required String domainAddress,
    required String domainOwner,
    required String centralState,
  }) {
    this.programAddress = programAddress;
    this.systemProgram = systemProgram;
    this.splNameServiceProgram = splNameServiceProgram;
    this.payer = payer;
    this.recordAddress = recordAddress;
    this.domainAddress = domainAddress;
    this.domainOwner = domainOwner;
    this.centralState = centralState;
  }

  /// Build the transaction instruction
  TransactionInstruction getInstruction() {
    final accounts = [
      AccountMeta(
        address: systemProgram,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: splNameServiceProgram,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: payer,
        role: AccountRole.writableSigner,
      ),
      AccountMeta(
        address: recordAddress,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: domainAddress,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: domainOwner,
        role: AccountRole.writableSigner,
      ),
      AccountMeta(
        address: centralState,
        role: AccountRole.readonly,
      ),
    ];

    return TransactionInstruction(
      programAddress: programAddress,
      accounts: accounts,
      data: serialize(),
    );
  }

  @override
  TransactionInstruction build() => getInstruction();
}
