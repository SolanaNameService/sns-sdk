import 'dart:typed_data';

import 'instruction_types.dart';

/// Parameters for creating a burn domain instruction
class BurnDomainInstructionParams {
  const BurnDomainInstructionParams({
    required this.nameServiceId,
    required this.systemProgram,
    required this.domainAddress,
    required this.reverse,
    required this.resellingState,
    required this.state,
    required this.centralState,
    required this.owner,
    required this.target,
    required this.programAddress,
  });

  /// The name service program address
  final String nameServiceId;

  /// The system program address
  final String systemProgram;

  /// The domain address to burn
  final String domainAddress;

  /// The reverse lookup address
  final String reverse;

  /// The reselling state address
  final String resellingState;

  /// The state address
  final String state;

  /// The central state address
  final String centralState;

  /// The owner address
  final String owner;

  /// The target address
  final String target;

  /// The program address
  final String programAddress;
}

/// Burn domain instruction for domain burning
///
/// This mirrors js-kit/src/instructions/burnDomainInstruction.ts
class BurnDomainInstruction extends SnsInstruction {
  BurnDomainInstruction({
    required this.params,
  });

  /// Instruction tag
  final int tag = 16;

  /// All parameters needed for instruction creation
  final BurnDomainInstructionParams params;

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
        address: params.nameServiceId,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: params.systemProgram,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: params.domainAddress,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: params.reverse,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: params.resellingState,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: params.state,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: params.centralState,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: params.owner,
        role: AccountRole.readonlySigner,
      ),
      AccountMeta(
        address: params.target,
        role: AccountRole.writable,
      ),
    ];

    return TransactionInstruction(
      programAddress: params.programAddress,
      accounts: accounts,
      data: data,
    );
  }
}
