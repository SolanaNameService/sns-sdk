import 'dart:typed_data';

import 'instruction_types.dart';

/// Realloc instruction for changing domain space allocation
///
/// This mirrors js-kit/src/instructions/reallocInstruction.ts
class ReallocInstruction extends SnsInstruction {
  ReallocInstruction({
    required this.space,
  });

  /// Instruction tag
  final int tag = 4;

  /// New space allocation
  final int space;

  String? _programAddress;
  String? _systemProgramId;
  String? _payerKey;
  String? _nameAccountKey;
  String? _nameOwnerKey;

  /// Set the parameters for the instruction
  void setParams({
    required String programAddress,
    required String systemProgramId,
    required String payerKey,
    required String nameAccountKey,
    required String nameOwnerKey,
  }) {
    _programAddress = programAddress;
    _systemProgramId = systemProgramId;
    _payerKey = payerKey;
    _nameAccountKey = nameAccountKey;
    _nameOwnerKey = nameOwnerKey;
  }

  @override
  Uint8List serialize() {
    final spaceBytes = Uint8List(4);
    spaceBytes.buffer.asByteData().setUint32(0, space, Endian.little);

    return Uint8List.fromList([
      tag,
      ...spaceBytes,
    ]);
  }

  @override
  TransactionInstruction build() {
    if (_programAddress == null ||
        _systemProgramId == null ||
        _payerKey == null ||
        _nameAccountKey == null ||
        _nameOwnerKey == null) {
      throw Exception(
          'Parameters not set for ReallocInstruction. Call setParams() first.');
    }

    final accounts = [
      AccountMeta(
        address: _systemProgramId!,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: _payerKey!,
        role: AccountRole.writableSigner,
      ),
      AccountMeta(
        address: _nameAccountKey!,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: _nameOwnerKey!,
        role: AccountRole.readonlySigner,
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
    required String systemProgramId,
    required String payerKey,
    required String nameAccountKey,
    required String nameOwnerKey,
  }) {
    setParams(
      programAddress: programAddress,
      systemProgramId: systemProgramId,
      payerKey: payerKey,
      nameAccountKey: nameAccountKey,
      nameOwnerKey: nameOwnerKey,
    );
    return build();
  }
}
