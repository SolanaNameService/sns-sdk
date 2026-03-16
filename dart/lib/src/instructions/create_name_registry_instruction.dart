import 'dart:convert';
import 'dart:typed_data';

import 'instruction_types.dart';

/// Parameters for creating a name registry instruction V3
class CreateNameRegistryInstructionV3Params {
  const CreateNameRegistryInstructionV3Params({
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
  });

  /// The domain name
  final String name;

  /// Space to allocate
  final int space;

  /// Optional referrer index
  final int? referrerIdxOpt;

  /// The program address
  final String programAddress;

  /// The naming service program address
  final String namingServiceProgram;

  /// The root domain address
  final String rootDomain;

  /// The name address
  final String nameAddress;

  /// The reverse lookup address
  final String reverseLookup;

  /// The system program address
  final String systemProgram;

  /// The central state address
  final String centralState;

  /// The buyer address
  final String buyer;

  /// The buyer token source address
  final String buyerTokenSource;

  /// The Pyth mapping account
  final String pythMappingAcc;

  /// The Pyth product account
  final String pythProductAcc;

  /// The Pyth price account
  final String pythPriceAcc;

  /// The vault address
  final String vault;

  /// The SPL token program address
  final String splTokenProgram;

  /// The rent sysvar address
  final String rentSysvar;

  /// The state address
  final String state;
}

/// Create name registry instruction V3 for domain registration
///
/// This mirrors js-kit/src/instructions/createInstructionV3.ts
class CreateNameRegistryInstructionV3 extends SnsInstruction {
  CreateNameRegistryInstructionV3({
    required this.name,
    required this.space,
    required this.params,
    this.referrerIdxOpt,
  });

  /// Instruction tag
  final int tag = 13;

  /// The domain name
  final String name;

  /// Space to allocate
  final int space;

  /// Optional referrer index
  final int? referrerIdxOpt;

  /// All parameters needed for instruction creation
  final CreateNameRegistryInstructionV3Params params;

  @override
  Uint8List serialize() {
    // Serialize instruction data:
    // tag (1) + name_length (4) + name + space (4) + referrer_opt (1 + 2 if present)
    final nameBytes = utf8.encode(name);
    final hasReferrer = referrerIdxOpt != null;
    final referrerSize =
        hasReferrer ? 3 : 1; // 1 byte option flag + 2 bytes value if present

    final data = ByteData(1 + 4 + nameBytes.length + 4 + referrerSize);
    var offset = 0;

    // Write tag
    data.setUint8(offset, tag);
    offset += 1;

    // Write name length (little endian)
    data.setUint32(offset, nameBytes.length, Endian.little);
    offset += 4;

    // Create final byte array
    final result = Uint8List(1 + 4 + nameBytes.length + 4 + referrerSize);
    result[0] = tag;

    // Copy name length
    result.setRange(1, 5, data.buffer.asUint8List(1, 4));

    // Copy name bytes
    result.setRange(5, 5 + nameBytes.length, nameBytes);
    offset = 5 + nameBytes.length;

    // Write space (little endian)
    final spaceData = ByteData(4);
    spaceData.setUint32(0, space, Endian.little);
    result.setRange(offset, offset + 4, spaceData.buffer.asUint8List());
    offset += 4;

    // Write referrer option
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
