import 'dart:convert';
import 'dart:typed_data';

import '../constants/addresses.dart';
import 'instruction_types.dart';

/// Create name registry instruction V2
///
/// This mirrors js-kit/src/instructions/createV2Instruction.ts
class CreateV2Instruction extends SnsInstruction {
  CreateV2Instruction({
    required this.name,
    required this.space,
  });

  /// Instruction tag
  final int tag = 9;

  /// The domain name
  final String name;

  /// Space to allocate
  final int space;

  @override
  Uint8List serialize() {
    final nameBytes = utf8.encode(name);
    final nameLength = Uint8List(4);
    nameLength.buffer
        .asByteData()
        .setUint32(0, nameBytes.length, Endian.little);

    final spaceBytes = Uint8List(4);
    spaceBytes.buffer.asByteData().setUint32(0, space, Endian.little);

    return Uint8List.fromList([
      tag,
      ...nameLength,
      ...nameBytes,
      ...spaceBytes,
    ]);
  }

  /// Parameters for building the instruction
  late final String programAddress;
  late final String rentSysvarAccount;
  late final String nameProgramId;
  late final String rootDomain;
  late final String nameAccount;
  late final String reverseLookupAccount;
  late final String centralState;
  late final String buyer;
  late final String buyerTokenAccount;
  late final String usdcVault;
  late final String state;

  /// Set parameters for building the instruction
  void setParams({
    required String programAddress,
    required String rentSysvarAccount,
    required String nameProgramId,
    required String rootDomain,
    required String nameAccount,
    required String reverseLookupAccount,
    required String centralState,
    required String buyer,
    required String buyerTokenAccount,
    required String usdcVault,
    required String state,
  }) {
    this.programAddress = programAddress;
    this.rentSysvarAccount = rentSysvarAccount;
    this.nameProgramId = nameProgramId;
    this.rootDomain = rootDomain;
    this.nameAccount = nameAccount;
    this.reverseLookupAccount = reverseLookupAccount;
    this.centralState = centralState;
    this.buyer = buyer;
    this.buyerTokenAccount = buyerTokenAccount;
    this.usdcVault = usdcVault;
    this.state = state;
  }

  /// Build the transaction instruction
  TransactionInstruction getInstruction() {
    final accounts = [
      AccountMeta(
        address: rentSysvarAccount,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: nameProgramId,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: rootDomain,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: nameAccount,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: reverseLookupAccount,
        role: AccountRole.writable,
      ),
      const AccountMeta(
        address: systemProgramAddress,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: centralState,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: buyer,
        role: AccountRole.writableSigner,
      ),
      AccountMeta(
        address: buyerTokenAccount,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: usdcVault,
        role: AccountRole.writable,
      ),
      const AccountMeta(
        address: tokenProgramAddress,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: state,
        role: AccountRole.readonly,
      ),
    ];

    return TransactionInstruction(
      programAddress: programAddress,
      accounts: accounts,
      data: serialize(),
    );
  }

  @override
  TransactionInstruction build() => getInstruction();
}
