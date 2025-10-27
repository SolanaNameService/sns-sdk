import 'dart:typed_data';
import 'package:solana/solana.dart' hide RpcClient;

import 'instruction_types.dart';

/// Update name registry instruction
///
/// This mirrors js-kit/src/instructions/updateNameRegistryInstruction.ts
class UpdateNameRegistryInstruction extends SnsInstruction {
  UpdateNameRegistryInstruction({
    required this.offset,
    required this.inputData,
  });

  /// Instruction tag
  final int tag = 1;

  /// Offset in the account data
  final int offset;

  /// Input data to write
  final Uint8List inputData;

  String? _programAddress;
  String? _domainAddress;
  String? _signer;

  /// Set the parameters for the instruction
  void setParams({
    required String programAddress,
    required String domainAddress,
    required String signer,
  }) {
    _programAddress = programAddress;
    _domainAddress = domainAddress;
    _signer = signer;
  }

  @override
  Uint8List serialize() {
    final offsetBytes = Uint8List(4);
    offsetBytes.buffer.asByteData().setUint32(0, offset, Endian.little);

    final dataLength = Uint8List(4);
    dataLength.buffer
        .asByteData()
        .setUint32(0, inputData.length, Endian.little);

    return Uint8List.fromList([
      tag,
      ...offsetBytes,
      ...dataLength,
      ...inputData,
    ]);
  }

  @override
  TransactionInstruction build() {
    if (_programAddress == null || _domainAddress == null || _signer == null) {
      throw Exception(
          'Parameters not set for UpdateNameRegistryInstruction. Call setParams() first.');
    }

    final accounts = [
      AccountMeta(
        address: _domainAddress!,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: _signer!,
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
    required String domainAddress,
    required String signer,
  }) {
    setParams(
      programAddress: programAddress,
      domainAddress: domainAddress,
      signer: signer,
    );
    return build();
  }
}

/// Creates an update name registry instruction (function wrapper)
///
/// [programId] - The name registry program ID
/// [nameAccount] - The name account to update
/// [offset] - The offset in the account data
/// [data] - The data to write
/// [signer] - The signer account that has authority to update
///
/// Returns a TransactionInstruction for updating the name registry
TransactionInstruction updateNameRegistryInstruction(
  Ed25519HDPublicKey programId,
  Ed25519HDPublicKey nameAccount,
  int offset,
  Uint8List data,
  Ed25519HDPublicKey signer,
) {
  final instruction = UpdateNameRegistryInstruction(
    offset: offset,
    inputData: data,
  );
  return instruction.getInstruction(
    programAddress: programId.toBase58(),
    domainAddress: nameAccount.toBase58(),
    signer: signer.toBase58(),
  );
}
