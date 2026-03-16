import 'dart:typed_data';

import '../constants/addresses.dart';
import 'instruction_types.dart';

/// Parameters for creating a transfer instruction
class TransferInstructionParams {
  const TransferInstructionParams({
    required this.newOwner,
    required this.programAddress,
    required this.domainAddress,
    required this.currentOwner,
    this.classAddress,
    this.parentAddress,
    this.parentOwner,
  });

  /// The new owner address
  final String newOwner;

  /// The program address
  final String programAddress;

  /// The domain address to transfer
  final String domainAddress;

  /// The current owner address
  final String currentOwner;

  /// Optional class address
  final String? classAddress;

  /// Optional parent address
  final String? parentAddress;

  /// Optional parent owner address
  final String? parentOwner;
}

/// Transfer instruction for domain ownership transfer
///
/// This mirrors js-kit/src/instructions/transferInstruction.ts
class TransferInstruction extends SnsInstruction {
  TransferInstruction({
    required this.newOwner,
    required this.params,
  });

  /// Instruction tag
  final int tag = 2;

  /// The new owner address (32 bytes)
  final String newOwner;

  /// All parameters needed for instruction creation
  final TransferInstructionParams params;

  @override
  Uint8List serialize() {
    // Serialize: tag (1 byte) + new_owner_address (32 bytes)
    final result = Uint8List(33);

    // Write tag
    result[0] = tag;

    // Decode new owner address and write it
    final newOwnerBytes = _base58Decode(newOwner);
    if (newOwnerBytes.length != 32) {
      throw ArgumentError(
          'Invalid address length: expected 32 bytes, got ${newOwnerBytes.length}');
    }

    result.setRange(1, 33, newOwnerBytes);

    return result;
  }

  @override
  TransactionInstruction build() {
    final data = serialize();

    final accounts = <AccountMeta>[
      AccountMeta(
        address: params.domainAddress,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: params.parentOwner ?? params.currentOwner,
        role: AccountRole.readonlySigner,
      ),
    ];

    // Add class address if provided
    if (params.classAddress != null) {
      accounts.add(AccountMeta(
        address: params.classAddress!,
        role: AccountRole.readonlySigner,
      ));
    }

    // Handle parent owner and address logic
    if (params.parentOwner != null && params.parentAddress != null) {
      // If no class address was added, add system program address
      if (params.classAddress == null) {
        accounts.add(const AccountMeta(
          address: systemProgramAddress,
          role: AccountRole.readonly,
        ));
      }

      accounts.add(AccountMeta(
        address: params.parentAddress!,
        role: AccountRole.readonly,
      ));
    }

    return TransactionInstruction(
      programAddress: params.programAddress,
      accounts: accounts,
      data: data,
    );
  }

  /// Base58 decode helper
  List<int> _base58Decode(String input) {
    const alphabet =
        '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

    if (input.isEmpty) return [];

    // Count leading zeros
    var leadingZeros = 0;
    for (var i = 0; i < input.length; i++) {
      if (input[i] == '1') {
        leadingZeros++;
      } else {
        break;
      }
    }

    // Decode base58
    var decoded = BigInt.zero;
    final base = BigInt.from(58);

    for (var i = leadingZeros; i < input.length; i++) {
      final char = input[i];
      final index = alphabet.indexOf(char);
      if (index == -1) {
        throw ArgumentError('Invalid base58 character: $char');
      }
      decoded = decoded * base + BigInt.from(index);
    }

    // Convert to bytes
    final bytes = <int>[];
    while (decoded > BigInt.zero) {
      bytes.insert(0, (decoded % BigInt.from(256)).toInt());
      decoded = decoded ~/ BigInt.from(256);
    }

    // Add leading zeros
    for (var i = 0; i < leadingZeros; i++) {
      bytes.insert(0, 0);
    }

    // Ensure exactly 32 bytes for addresses
    while (bytes.length < 32) {
      bytes.insert(0, 0);
    }

    return bytes;
  }
}
