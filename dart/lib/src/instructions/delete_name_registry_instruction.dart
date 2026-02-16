import 'dart:typed_data';
import 'package:solana/solana.dart' hide RpcClient;

import 'instruction_types.dart';

/// Delete name registry instruction
///
/// This mirrors js-kit/src/instructions/deleteNameRegistryInstruction.ts
class DeleteNameRegistryInstruction extends SnsInstruction {
  DeleteNameRegistryInstruction();

  /// Instruction tag
  final int tag = 3;

  String? _programAddress;
  String? _domainAddress;
  String? _refundTarget;
  String? _owner;

  /// Set the parameters for the instruction
  void setParams({
    required String programAddress,
    required String domainAddress,
    required String refundTarget,
    required String owner,
  }) {
    _programAddress = programAddress;
    _domainAddress = domainAddress;
    _refundTarget = refundTarget;
    _owner = owner;
  }

  @override
  Uint8List serialize() => Uint8List.fromList([tag]);

  @override
  TransactionInstruction build() {
    if (_programAddress == null ||
        _domainAddress == null ||
        _refundTarget == null ||
        _owner == null) {
      throw Exception(
          'Parameters not set for DeleteNameRegistryInstruction. Call setParams() first.');
    }

    final accounts = [
      AccountMeta(
        address: _domainAddress!,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: _owner!,
        role: AccountRole.readonlySigner,
      ),
      AccountMeta(
        address: _refundTarget!,
        role: AccountRole.writable,
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
    required String refundTarget,
    required String owner,
  }) {
    setParams(
      programAddress: programAddress,
      domainAddress: domainAddress,
      refundTarget: refundTarget,
      owner: owner,
    );
    return build();
  }
}

/// Creates a delete name registry instruction (function wrapper)
///
/// [programId] - The name registry program ID
/// [nameAccount] - The name account to delete
/// [payer] - The fee payer account
/// [owner] - The owner account that has authority to delete
///
/// Returns a TransactionInstruction for deleting the name registry
TransactionInstruction deleteNameRegistryInstruction(
  Ed25519HDPublicKey programId,
  Ed25519HDPublicKey nameAccount,
  Ed25519HDPublicKey payer,
  Ed25519HDPublicKey owner,
) {
  final instruction = DeleteNameRegistryInstruction();
  return instruction.getInstruction(
    programAddress: programId.toBase58(),
    domainAddress: nameAccount.toBase58(),
    refundTarget: payer.toBase58(),
    owner: owner.toBase58(),
  );
}
