import 'dart:typed_data';

import 'instruction_types.dart';

/// Write Right of Association (RoA) instruction
///
/// This mirrors js-kit/src/instructions/writeRoaInstruction.ts
class WriteRoaInstruction extends SnsInstruction {
  WriteRoaInstruction({
    required this.roaId,
  });

  /// Instruction tag
  final int tag = 6;

  /// RoA ID as address bytes
  final Uint8List roaId;

  String? _programAddress;
  String? _systemProgram;
  String? _splNameServiceProgram;
  String? _feePayer;
  String? _record;
  String? _domain;
  String? _domainOwner;
  String? _centralState;

  /// Set the parameters for the instruction
  void setParams({
    required String programAddress,
    required String systemProgram,
    required String splNameServiceProgram,
    required String feePayer,
    required String record,
    required String domain,
    required String domainOwner,
    required String centralState,
  }) {
    _programAddress = programAddress;
    _systemProgram = systemProgram;
    _splNameServiceProgram = splNameServiceProgram;
    _feePayer = feePayer;
    _record = record;
    _domain = domain;
    _domainOwner = domainOwner;
    _centralState = centralState;
  }

  @override
  Uint8List serialize() {
    final roaIdLength = Uint8List(4);
    roaIdLength.buffer.asByteData().setUint32(0, roaId.length, Endian.little);

    return Uint8List.fromList([
      tag,
      ...roaIdLength,
      ...roaId,
    ]);
  }

  @override
  TransactionInstruction build() {
    if (_programAddress == null ||
        _systemProgram == null ||
        _splNameServiceProgram == null ||
        _feePayer == null ||
        _record == null ||
        _domain == null ||
        _domainOwner == null ||
        _centralState == null) {
      throw Exception(
          'Parameters not set for WriteRoaInstruction. Call setParams() first.');
    }

    final accounts = [
      AccountMeta(
        address: _systemProgram!,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: _splNameServiceProgram!,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: _feePayer!,
        role: AccountRole.writableSigner,
      ),
      AccountMeta(
        address: _record!,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: _domain!,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: _domainOwner!,
        role: AccountRole.writableSigner,
      ),
      AccountMeta(
        address: _centralState!,
        role: AccountRole.readonly,
      ),
    ];

    return TransactionInstruction(
      programAddress: _programAddress!,
      accounts: accounts,
      data: serialize(),
    );
  }

  /// Build the transaction instruction
  TransactionInstruction getInstruction({
    required String programAddress,
    required String systemProgram,
    required String splNameServiceProgram,
    required String feePayer,
    required String record,
    required String domain,
    required String domainOwner,
    required String centralState,
  }) {
    setParams(
      programAddress: programAddress,
      systemProgram: systemProgram,
      splNameServiceProgram: splNameServiceProgram,
      feePayer: feePayer,
      record: record,
      domain: domain,
      domainOwner: domainOwner,
      centralState: centralState,
    );
    return build();
  }
}
