import 'dart:typed_data';

import 'instruction_types.dart';

/// Parameters for creating a delete record instruction
class DeleteRecordInstructionParams {
  const DeleteRecordInstructionParams({
    required this.systemProgram,
    required this.splNameServiceProgram,
    required this.payer,
    required this.record,
    required this.domainAddress,
    required this.domainOwner,
    required this.centralState,
    required this.programAddress,
  });

  /// The system program address
  final String systemProgram;

  /// The SPL name service program address
  final String splNameServiceProgram;

  /// The payer address
  final String payer;

  /// The record address to delete
  final String record;

  /// The domain address
  final String domainAddress;

  /// The domain owner address
  final String domainOwner;

  /// The central state address
  final String centralState;

  /// The program address
  final String programAddress;
}

/// Delete record instruction for deleting domain records
///
/// This mirrors js-kit/src/instructions/deleteRecordInstruction.ts
class DeleteRecordInstruction extends SnsInstruction {
  DeleteRecordInstruction({
    required this.params,
  });

  /// Instruction tag
  final int tag = 5;

  /// All parameters needed for instruction creation
  final DeleteRecordInstructionParams params;

  @override
  Uint8List serialize() {
    // Serialize: tag (1 byte)
    final result = Uint8List(1);
    result[0] = tag;
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
        address: params.payer,
        role: AccountRole.writableSigner,
      ),
      AccountMeta(
        address: params.record,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: params.domainAddress,
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
}
