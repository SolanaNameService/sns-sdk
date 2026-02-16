import 'dart:typed_data';

import 'instruction_types.dart';

/// Validate Right of Association (RoA) Ethereum instruction
///
/// This mirrors js-kit/src/instructions/validateRoaEthereumInstruction.ts
class ValidateRoaEthereumInstruction extends SnsInstruction {
  ValidateRoaEthereumInstruction({
    required this.validation,
    required this.signature,
    required this.expectedPubkey,
  });

  /// Instruction tag
  final int tag = 4;

  /// Validation type
  final int validation;

  /// Ethereum signature
  final Uint8List signature;

  /// Expected public key
  final Uint8List expectedPubkey;

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
    final signatureLength = Uint8List(4);
    signatureLength.buffer
        .asByteData()
        .setUint32(0, signature.length, Endian.little);

    final pubkeyLength = Uint8List(4);
    pubkeyLength.buffer
        .asByteData()
        .setUint32(0, expectedPubkey.length, Endian.little);

    return Uint8List.fromList([
      tag,
      validation,
      ...signatureLength,
      ...signature,
      ...pubkeyLength,
      ...expectedPubkey,
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
          'Parameters not set for ValidateRoaEthereumInstruction. Call setParams() first.');
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
