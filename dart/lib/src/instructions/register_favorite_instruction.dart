import 'dart:typed_data';

import 'instruction_types.dart';

/// Parameters for creating a register favorite instruction
class RegisterFavoriteInstructionParams {
  const RegisterFavoriteInstructionParams({
    required this.nameAccount,
    required this.favoriteAccount,
    required this.owner,
    required this.systemProgram,
    required this.programAddress,
    this.optParent,
  });

  /// The name account address
  final String nameAccount;

  /// The favorite account address
  final String favoriteAccount;

  /// The owner address
  final String owner;

  /// The system program address
  final String systemProgram;

  /// Optional parent address
  final String? optParent;

  /// The program address
  final String programAddress;
}

/// Register favorite instruction for registering favorite domains
///
/// This mirrors js-kit/src/instructions/registerFavoriteInstruction.ts
class RegisterFavoriteInstruction extends SnsInstruction {
  RegisterFavoriteInstruction({
    required this.params,
  });

  /// Instruction tag
  final int tag = 6;

  /// All parameters needed for instruction creation
  final RegisterFavoriteInstructionParams params;

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
        address: params.nameAccount,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: params.favoriteAccount,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: params.owner,
        role: AccountRole.writableSigner,
      ),
      AccountMeta(
        address: params.systemProgram,
        role: AccountRole.readonly,
      ),
    ];

    // Add optional parent if provided
    if (params.optParent != null) {
      accounts.add(AccountMeta(
        address: params.optParent!,
        role: AccountRole.readonly,
      ));
    }

    return TransactionInstruction(
      programAddress: params.programAddress,
      accounts: accounts,
      data: data,
    );
  }
}
