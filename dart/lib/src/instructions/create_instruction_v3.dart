import 'dart:convert';
import 'dart:typed_data';

import 'instruction_types.dart';

/// Parameters for the CreateInstructionV3
class CreateInstructionV3Params {
  const CreateInstructionV3Params({
    required this.name,
    required this.space,
    required this.programAddress,
    required this.namingServiceProgram,
    required this.rootDomain,
    required this.nameAddress,
    required this.reverseLookup,
    required this.systemProgram,
    required this.centralState,
    required this.buyer,
    required this.buyerTokenSource,
    required this.pythMappingAcc,
    required this.pythProductAcc,
    required this.pythPriceAcc,
    required this.vault,
    required this.splTokenProgram,
    required this.rentSysvar,
    required this.state,
    this.referrerIdxOpt,
    this.referrerAccountOpt,
  });

  /// The domain name to register
  final String name;

  /// Space to allocate for the domain
  final int space;

  /// Optional referrer index
  final int? referrerIdxOpt;

  /// Program address
  final String programAddress;

  /// Naming service program
  final String namingServiceProgram;

  /// Root domain address
  final String rootDomain;

  /// Name account address
  final String nameAddress;

  /// Reverse lookup address
  final String reverseLookup;

  /// System program address
  final String systemProgram;

  /// Central state address
  final String centralState;

  /// Buyer address
  final String buyer;

  /// Buyer token source address
  final String buyerTokenSource;

  /// Pyth mapping account
  final String pythMappingAcc;

  /// Pyth product account
  final String pythProductAcc;

  /// Pyth price account
  final String pythPriceAcc;

  /// Vault address
  final String vault;

  /// SPL token program address
  final String splTokenProgram;

  /// Rent sysvar address
  final String rentSysvar;

  /// State address
  final String state;

  /// Optional referrer account
  final String? referrerAccountOpt;
}

/// CreateInstructionV3 - Domain registration instruction
///
/// This mirrors js-kit/src/instructions/createInstructionV3.ts with exact
/// Borsh schema matching: {tag: "u8", name: "string", space: "u32", referrerIdxOpt: {option: "u16"}}
class CreateInstructionV3 implements SnsInstruction {
  CreateInstructionV3({
    required this.name,
    required this.space,
    required this.params,
    this.referrerIdxOpt,
  });

  /// Instruction tag - must be 13 to match JS implementation
  final int tag = 13;

  /// Domain name to register
  final String name;

  /// Space to allocate
  final int space;

  /// Optional referrer index
  final int? referrerIdxOpt;

  /// All instruction parameters
  final CreateInstructionV3Params params;

  @override
  Uint8List serialize() {
    // Serialize using Borsh format exactly like JS implementation:
    // tag (u8) + name (string) + space (u32) + referrerIdxOpt (option<u16>)

    final nameBytes = utf8.encode(name);
    final hasReferrer = referrerIdxOpt != null;

    // Calculate total size:
    // 1 (tag) + 4 (name length) + nameBytes.length + 4 (space) + 1 (option flag) + (2 if has referrer)
    final referrerSize =
        hasReferrer ? 3 : 1; // 1 byte option flag + 2 bytes value if present
    final totalSize = 1 + 4 + nameBytes.length + 4 + referrerSize;

    final result = Uint8List(totalSize);
    var offset = 0;

    // Write tag (u8)
    result[offset] = tag;
    offset += 1;

    // Write name length (u32, little endian)
    final nameLengthData = ByteData(4);
    nameLengthData.setUint32(0, nameBytes.length, Endian.little);
    result.setRange(offset, offset + 4, nameLengthData.buffer.asUint8List());
    offset += 4;

    // Write name bytes
    result.setRange(offset, offset + nameBytes.length, nameBytes);
    offset += nameBytes.length;

    // Write space (u32, little endian)
    final spaceData = ByteData(4);
    spaceData.setUint32(0, space, Endian.little);
    result.setRange(offset, offset + 4, spaceData.buffer.asUint8List());
    offset += 4;

    // Write referrer option (option<u16>)
    if (hasReferrer) {
      result[offset] = 1; // Some variant
      offset += 1;
      final referrerData = ByteData(2);
      referrerData.setUint16(0, referrerIdxOpt!, Endian.little);
      result.setRange(offset, offset + 2, referrerData.buffer.asUint8List());
    } else {
      result[offset] = 0; // None variant
    }

    return result;
  }

  @override
  TransactionInstruction build() {
    final data = serialize();

    final accounts = <AccountMeta>[
      AccountMeta(
        address: params.namingServiceProgram,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: params.rootDomain,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: params.nameAddress,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: params.reverseLookup,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: params.systemProgram,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: params.centralState,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: params.buyer,
        role: AccountRole.writableSigner,
      ),
      AccountMeta(
        address: params.buyerTokenSource,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: params.pythMappingAcc,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: params.pythProductAcc,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: params.pythPriceAcc,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: params.vault,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: params.splTokenProgram,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: params.rentSysvar,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: params.state,
        role: AccountRole.readonly,
      ),
    ];

    // Add optional referrer account if provided
    if (params.referrerAccountOpt != null) {
      accounts.add(AccountMeta(
        address: params.referrerAccountOpt!,
        role: AccountRole.writable,
      ));
    }

    return TransactionInstruction(
      programAddress: params.programAddress,
      accounts: accounts,
      data: data,
    );
  }
}
