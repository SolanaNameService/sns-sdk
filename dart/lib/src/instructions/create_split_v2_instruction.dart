import 'dart:convert';
import 'dart:typed_data';

import '../instructions/instruction_types.dart';

/// Parameters for creating a split V2 instruction
class CreateSplitV2InstructionParams {
  const CreateSplitV2InstructionParams({
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
    required this.domainOwner,
    required this.feePayer,
    required this.buyerTokenSource,
    required this.pythFeedAccount,
    required this.vault,
    required this.splTokenProgram,
    required this.rentSysvar,
    required this.state,
    this.referrerIdxOpt,
    this.referrerAccountOpt,
  });

  /// The domain name
  final String name;

  /// The space allocation
  final int space;

  /// Optional referrer index
  final int? referrerIdxOpt;

  /// Program address
  final String programAddress;

  /// Naming service program address
  final String namingServiceProgram;

  /// Root domain address
  final String rootDomain;

  /// Domain name address
  final String nameAddress;

  /// Reverse lookup address
  final String reverseLookup;

  /// System program address
  final String systemProgram;

  /// Central state address
  final String centralState;

  /// Buyer address
  final String buyer;

  /// Domain owner address
  final String domainOwner;

  /// Fee payer address
  final String feePayer;

  /// Buyer token source address
  final String buyerTokenSource;

  /// Pyth feed account address
  final String pythFeedAccount;

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

/// Create split V2 instruction for domain registration
///
/// This mirrors js-kit/src/instructions/createSplitV2Instruction.ts
class CreateSplitV2Instruction extends SnsInstruction {
  CreateSplitV2Instruction({
    required this.name,
    required this.space,
    required this.params,
    this.referrerIdxOpt,
  });

  /// Instruction tag
  final int tag = 20;

  /// The domain name
  final String name;

  /// The space allocation
  final int space;

  /// Optional referrer index
  final int? referrerIdxOpt;

  /// All parameters needed for instruction creation
  final CreateSplitV2InstructionParams params;

  @override
  Uint8List serialize() {
    // Serialize: tag (1 byte) + name (string) + space (u32) + referrerIdxOpt (option u16)
    final nameBytes = utf8.encode(name);
    final nameLength = nameBytes.length;

    // Calculate size: tag + name_length + name + space + referrer_opt
    var totalSize = 1 + 4 + nameLength + 4; // tag + name_len + name + space

    // Add space for optional referrer (1 byte for presence + 2 bytes for u16)
    totalSize += 3;

    final result = Uint8List(totalSize);
    var offset = 0;

    // Write tag
    result[offset] = tag;
    offset += 1;

    // Write name string length (little-endian)
    _writeLittleEndian32(result, offset, nameLength);
    offset += 4;

    // Write name string
    result.setRange(offset, offset + nameLength, nameBytes);
    offset += nameLength;

    // Write space (little-endian u32)
    _writeLittleEndian32(result, offset, space);
    offset += 4;

    // Write optional referrer index
    if (referrerIdxOpt != null) {
      result[offset] = 1; // Present
      offset += 1;
      _writeLittleEndian16(result, offset, referrerIdxOpt!);
    } else {
      result[offset] = 0; // Not present
      offset += 1;
      result[offset] = 0; // Padding
      result[offset + 1] = 0; // Padding
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
        address: params.domainOwner,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: params.feePayer,
        role: AccountRole.writableSigner,
      ),
      AccountMeta(
        address: params.buyerTokenSource,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: params.pythFeedAccount,
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

    // Add optional referrer account
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

  /// Helper to write 32-bit little-endian integer
  void _writeLittleEndian32(Uint8List buffer, int offset, int value) {
    buffer[offset] = value & 0xFF;
    buffer[offset + 1] = (value >> 8) & 0xFF;
    buffer[offset + 2] = (value >> 16) & 0xFF;
    buffer[offset + 3] = (value >> 24) & 0xFF;
  }

  /// Helper to write 16-bit little-endian integer
  void _writeLittleEndian16(Uint8List buffer, int offset, int value) {
    buffer[offset] = value & 0xFF;
    buffer[offset + 1] = (value >> 8) & 0xFF;
  }
}
