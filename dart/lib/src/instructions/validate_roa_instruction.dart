import 'dart:typed_data';

import 'instruction_types.dart';

/// Validate Right of Association (RoA) instruction
///
/// This mirrors js-kit/src/instructions/validateRoaInstruction.ts
class ValidateRoaInstruction extends SnsInstruction {
  ValidateRoaInstruction({
    required this.staleness,
  });

  /// Instruction tag
  final int tag = 3;

  /// Whether to check staleness
  final bool staleness;

  String? _programAddress;
  String? _systemProgram;
  String? _splNameServiceProgram;
  String? _feePayer;
  String? _record;
  String? _domain;
  String? _domainOwner;
  String? _centralState;
  String? _verifier;

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
    required String verifier,
  }) {
    _programAddress = programAddress;
    _systemProgram = systemProgram;
    _splNameServiceProgram = splNameServiceProgram;
    _feePayer = feePayer;
    _record = record;
    _domain = domain;
    _domainOwner = domainOwner;
    _centralState = centralState;
    _verifier = verifier;
  }

  @override
  Uint8List serialize() => Uint8List.fromList([
        tag,
        if (staleness) 1 else 0,
      ]);

  @override
  TransactionInstruction build() {
    if (_programAddress == null ||
        _systemProgram == null ||
        _splNameServiceProgram == null ||
        _feePayer == null ||
        _record == null ||
        _domain == null ||
        _domainOwner == null ||
        _centralState == null ||
        _verifier == null) {
      throw Exception(
          'Parameters not set for ValidateRoaInstruction. Call setParams() first.');
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
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: _centralState!,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: _verifier!,
        role: AccountRole.writableSigner,
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
    required String verifier,
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
      verifier: verifier,
    );
    return build();
  }
}
