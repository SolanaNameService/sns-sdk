import 'dart:convert';
import 'dart:typed_data';
import 'package:crypto/crypto.dart';

/// Account role in a Solana transaction
enum AccountRole {
  /// Read-only account
  readonly,

  /// Writable account
  writable,

  /// Signer account (read-only)
  readonlySigner,

  /// Writable signer account
  writableSigner,
}

/// Enhanced account metadata for transaction instructions
class AccountMeta {
  const AccountMeta({
    required this.address,
    required this.role,
  });

  /// The account address
  final String address;

  /// The account role
  final AccountRole role;

  /// Whether this account is a signer
  bool get isSigner =>
      role == AccountRole.readonlySigner || role == AccountRole.writableSigner;

  /// Whether this account is writable
  bool get isWritable =>
      role == AccountRole.writable || role == AccountRole.writableSigner;

  /// Create a writable signer account
  static AccountMeta writableSigner(String address) =>
      AccountMeta(address: address, role: AccountRole.writableSigner);

  /// Create a readonly signer account
  static AccountMeta readonlySigner(String address) =>
      AccountMeta(address: address, role: AccountRole.readonlySigner);

  /// Create a writable account
  static AccountMeta writable(String address) =>
      AccountMeta(address: address, role: AccountRole.writable);

  /// Create a readonly account
  static AccountMeta readonly(String address) =>
      AccountMeta(address: address, role: AccountRole.readonly);

  @override
  String toString() => 'AccountMeta(address: $address, role: $role)';

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AccountMeta &&
          runtimeType == other.runtimeType &&
          address == other.address &&
          role == other.role;

  @override
  int get hashCode => address.hashCode ^ role.hashCode;
}

/// Enhanced Solana transaction instruction with improved serialization
class TransactionInstruction {
  const TransactionInstruction({
    required this.programAddress,
    required this.accounts,
    required this.data,
  });

  /// The program address that will execute this instruction
  final String programAddress;

  /// List of accounts involved in this instruction
  final List<AccountMeta> accounts;

  /// The instruction data
  final Uint8List data;

  /// Validate account ordering (signers must come first)
  void validateAccountOrdering() {
    var hasNonSigner = false;
    for (final account in accounts) {
      if (hasNonSigner && account.isSigner) {
        throw ArgumentError(
            'Invalid account ordering: Signer accounts must come before non-signer accounts');
      }
      if (!account.isSigner) {
        hasNonSigner = true;
      }
    }
  }

  /// Get all unique public keys referenced in this instruction
  List<String> get publicKeys {
    final keys = <String>{programAddress};
    for (final account in accounts) {
      keys.add(account.address);
    }
    return keys.toList();
  }

  @override
  String toString() =>
      'TransactionInstruction(program: $programAddress, accounts: ${accounts.length}, data: ${data.length} bytes)';
}

/// Enhanced instruction builder with Borsh serialization support
abstract class EnhancedInstructionBuilder {
  /// Build the transaction instruction with proper serialization
  TransactionInstruction build();

  /// Serialize instruction data for compatibility with Anchor programs
  /// This provides basic Borsh-compatible serialization for common types
  static Uint8List serializeBorsh<T>(T data) {
    if (data is Map<String, dynamic>) {
      return serializeBasicData(data);
    } else if (data is List<int>) {
      return Uint8List.fromList(data);
    } else if (data is Uint8List) {
      return data;
    } else if (data is String) {
      // Borsh string: length (4 bytes) + UTF-8 bytes
      final bytes = utf8.encode(data);
      final buffer = ByteData(4 + bytes.length);
      buffer.setUint32(0, bytes.length, Endian.little);
      return Uint8List.fromList([
        ...buffer.buffer.asUint8List(),
        ...bytes,
      ]);
    } else if (data is int) {
      // Assume 64-bit little-endian integer
      final buffer = ByteData(8);
      buffer.setInt64(0, data, Endian.little);
      return buffer.buffer.asUint8List();
    } else {
      throw ArgumentError(
          'Unsupported data type for Borsh serialization: ${data.runtimeType}');
    }
  }

  /// Serialize basic data types to instruction format
  static Uint8List serializeBasicData(Map<String, dynamic> data) {
    // Basic serialization for common instruction data patterns
    final buffer = <int>[];

    for (final entry in data.entries) {
      final value = entry.value;
      if (value is int) {
        // Add 32-bit little-endian integer
        buffer.addAll([
          value & 0xFF,
          (value >> 8) & 0xFF,
          (value >> 16) & 0xFF,
          (value >> 24) & 0xFF,
        ]);
      } else if (value is String) {
        // Add length-prefixed string
        final bytes = utf8.encode(value);
        buffer.addAll([
          bytes.length & 0xFF,
          (bytes.length >> 8) & 0xFF,
          (bytes.length >> 16) & 0xFF,
          (bytes.length >> 24) & 0xFF,
        ]);
        buffer.addAll(bytes);
      } else if (value is List<int>) {
        buffer.addAll(value);
      }
    }

    return Uint8List.fromList(buffer);
  }

  /// Create instruction data from raw bytes with validation
  static Uint8List createInstructionData(List<int> bytes) {
    if (bytes.isEmpty) {
      throw ArgumentError('Instruction data cannot be empty');
    }
    return Uint8List.fromList(bytes);
  }

  /// Validate account requirements before building
  static void validateAccounts(List<AccountMeta> accounts) {
    if (accounts.isEmpty) {
      throw ArgumentError('Instruction must have at least one account');
    }

    // Validate that signers come first (Solana requirement)
    var hasNonSigner = false;
    for (final account in accounts) {
      if (hasNonSigner && account.isSigner) {
        throw ArgumentError(
            'Invalid account ordering: Signer accounts must come before non-signer accounts');
      }
      if (!account.isSigner) {
        hasNonSigner = true;
      }
    }

    // Check for duplicate accounts
    final addresses = accounts.map((a) => a.address).toSet();
    if (addresses.length != accounts.length) {
      throw ArgumentError(
          'Duplicate accounts are not allowed in a single instruction');
    }
  }

  /// Create instruction discriminator for Anchor programs
  static Uint8List createDiscriminator(String methodName) {
    // This creates an 8-byte discriminator for Anchor methods
    // Based on the first 8 bytes of sha256(namespace:method_name)
    final input = 'global:$methodName';
    final bytes = utf8.encode(input);
    final digest = sha256.convert(bytes);
    return Uint8List.fromList(digest.bytes.take(8).toList());
  }
}

/// Abstract base class for all SNS instructions
abstract class SnsInstruction {
  /// Serialize the instruction data
  Uint8List serialize();

  /// Build the transaction instruction
  TransactionInstruction build();
}
