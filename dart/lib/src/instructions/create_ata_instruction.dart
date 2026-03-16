import 'dart:typed_data';

import 'instruction_types.dart';

/// Create Associated Token Account (ATA) instruction
///
/// This mirrors js-kit/src/instructions/createAtaInstruction.ts
TransactionInstruction createAtaInstruction({
  required String programAddress,
  required String payer,
  required String ata,
  required String owner,
  required String mint,
  required String systemProgram,
  required String splTokenProgram,
}) {
  final accounts = [
    AccountMeta(
      address: payer,
      role: AccountRole.readonly,
    ),
    AccountMeta(
      address: ata,
      role: AccountRole.readonly,
    ),
    AccountMeta(
      address: owner,
      role: AccountRole.writable,
    ),
    AccountMeta(
      address: mint,
      role: AccountRole.writable,
    ),
    AccountMeta(
      address: systemProgram,
      role: AccountRole.readonly,
    ),
    AccountMeta(
      address: splTokenProgram,
      role: AccountRole.readonly,
    ),
  ];

  // For Associated Token Account creation, the instruction data is typically empty
  // or contains minimal data. The actual instruction is handled by the program.
  final data = Uint8List(0);

  return TransactionInstruction(
    programAddress: programAddress,
    accounts: accounts,
    data: data,
  );
}
