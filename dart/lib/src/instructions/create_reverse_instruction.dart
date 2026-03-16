import 'dart:convert';
import 'dart:typed_data';

import 'instruction_types.dart';

/// Parameters for creating a reverse instruction
class CreateReverseInstructionParams {
  const CreateReverseInstructionParams({
    required this.domain,
    required this.programAddress,
    required this.namingServiceProgram,
    required this.rootDomain,
    required this.reverseLookup,
    required this.systemProgram,
    required this.centralState,
    required this.payer,
    required this.rentSysvar,
    this.parentAddress,
    this.parentOwner,
  });

  /// The domain name for reverse lookup
  final String domain;

  /// The program address
  final String programAddress;

  /// The naming service program address
  final String namingServiceProgram;

  /// The root domain address
  final String rootDomain;

  /// The reverse lookup address
  final String reverseLookup;

  /// The system program address
  final String systemProgram;

  /// The central state address
  final String centralState;

  /// The payer address
  final String payer;

  /// The rent sysvar address
  final String rentSysvar;

  /// Optional parent address
  final String? parentAddress;

  /// Optional parent owner address
  final String? parentOwner;
}

/// Create reverse instruction for domain reverse lookup creation
///
/// This mirrors js-kit/src/instructions/createReverseInstruction.ts
class CreateReverseInstruction extends SnsInstruction {
  CreateReverseInstruction({
    required this.domain,
    required this.params,
  });

  /// Instruction tag
  final int tag = 12;

  /// The domain name
  final String domain;

  /// All parameters needed for instruction creation
  final CreateReverseInstructionParams params;

  @override
  Uint8List serialize() {
    // Serialize instruction data using simple format
    // tag (1 byte) + domain length (4 bytes) + domain
    final domainBytes = utf8.encode(domain);
    final data = ByteData(1 + 4 + domainBytes.length);

    // Write tag
    data.setUint8(0, tag);

    // Write domain length (little endian)
    data.setUint32(1, domainBytes.length, Endian.little);

    // Create final byte array
    final result = Uint8List(1 + 4 + domainBytes.length);
    result[0] = tag;

    // Copy domain length bytes
    final lengthBytes = data.buffer.asUint8List(1, 4);
    result.setRange(1, 5, lengthBytes);

    // Copy domain bytes
    result.setRange(5, 5 + domainBytes.length, domainBytes);

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
        address: params.payer,
        role: AccountRole.writableSigner,
      ),
      AccountMeta(
        address: params.rentSysvar,
        role: AccountRole.readonly,
      ),
    ];

    // Add optional accounts
    if (params.parentAddress != null) {
      accounts.add(AccountMeta(
        address: params.parentAddress!,
        role: AccountRole.writable,
      ));
    }

    if (params.parentOwner != null) {
      accounts.add(AccountMeta(
        address: params.parentOwner!,
        role: AccountRole.writableSigner,
      ));
    }

    return TransactionInstruction(
      programAddress: params.programAddress,
      accounts: accounts,
      data: data,
    );
  }
}
