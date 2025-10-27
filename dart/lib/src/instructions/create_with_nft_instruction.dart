import 'dart:convert';
import 'dart:typed_data';

import 'instruction_types.dart';

/// Create with NFT instruction for tokenized domain registration
///
/// This mirrors js-kit/src/instructions/createWithNftInstruction.ts
class CreateWithNftInstruction extends SnsInstruction {
  CreateWithNftInstruction({
    required this.name,
    required this.space,
  });

  /// Instruction tag
  final int tag = 17;

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
  late final String namingServiceProgram;
  late final String rootDomain;
  late final String nameAddress;
  late final String reverseLookup;
  late final String systemProgram;
  late final String centralState;
  late final String buyer;
  late final String nftSource;
  late final String nftMetadata;
  late final String nftMint;
  late final String masterEdition;
  late final String collection;
  late final String splTokenProgram;
  late final String rentSysvar;
  late final String state;
  late final String mplTokenMetadata;

  /// Set parameters for building the instruction
  void setParams({
    required String programAddress,
    required String namingServiceProgram,
    required String rootDomain,
    required String nameAddress,
    required String reverseLookup,
    required String systemProgram,
    required String centralState,
    required String buyer,
    required String nftSource,
    required String nftMetadata,
    required String nftMint,
    required String masterEdition,
    required String collection,
    required String splTokenProgram,
    required String rentSysvar,
    required String state,
    required String mplTokenMetadata,
  }) {
    this.programAddress = programAddress;
    this.namingServiceProgram = namingServiceProgram;
    this.rootDomain = rootDomain;
    this.nameAddress = nameAddress;
    this.reverseLookup = reverseLookup;
    this.systemProgram = systemProgram;
    this.centralState = centralState;
    this.buyer = buyer;
    this.nftSource = nftSource;
    this.nftMetadata = nftMetadata;
    this.nftMint = nftMint;
    this.masterEdition = masterEdition;
    this.collection = collection;
    this.splTokenProgram = splTokenProgram;
    this.rentSysvar = rentSysvar;
    this.state = state;
    this.mplTokenMetadata = mplTokenMetadata;
  }

  /// Build the transaction instruction
  TransactionInstruction getInstruction() {
    final accounts = [
      AccountMeta(
        address: namingServiceProgram,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: rootDomain,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: nameAddress,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: reverseLookup,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: systemProgram,
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
        address: nftSource,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: nftMetadata,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: nftMint,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: masterEdition,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: collection,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: splTokenProgram,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: rentSysvar,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: state,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: mplTokenMetadata,
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
