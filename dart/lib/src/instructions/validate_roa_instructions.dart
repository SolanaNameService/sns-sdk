import 'dart:typed_data';
import 'instruction_types.dart';

/// Instruction for validating right of association (ROA) with Pyth price feed
///
/// This instruction validates that a record owner has the right to associate
/// their domain with specific record data, using staleness checking for
/// price feed validation.
class ValidateRoaInstruction {
  const ValidateRoaInstruction({
    required this.staleness,
  });

  /// Instruction tag (discriminator)
  static const int tag = 3;

  /// Whether to perform staleness checking on the validation
  final bool staleness;

  /// Serialize the instruction data using manual serialization
  Uint8List serialize() {
    final result = Uint8List(2); // tag (u8) + staleness (bool)
    var offset = 0;

    // Write tag (u8)
    result[offset] = tag;
    offset += 1;

    // Write staleness (bool: 1 byte, 0=false, 1=true)
    result[offset] = staleness ? 1 : 0;

    return result;
  }

  /// Create the Solana instruction for validate ROA
  TransactionInstruction getInstruction({
    required String programAddress,
    required String systemProgram,
    required String splNameServiceProgram,
    required String feePayer,
    required String record,
    required String domain,
    required String domainOwner,
    required String centralState,
    required String verifier,
  }) {
    final data = serialize();

    final accounts = [
      AccountMeta(address: systemProgram, role: AccountRole.readonly),
      AccountMeta(address: splNameServiceProgram, role: AccountRole.readonly),
      AccountMeta(address: feePayer, role: AccountRole.writableSigner),
      AccountMeta(address: record, role: AccountRole.writable),
      AccountMeta(address: domain, role: AccountRole.writable),
      AccountMeta(address: domainOwner, role: AccountRole.writable),
      AccountMeta(address: centralState, role: AccountRole.readonly),
      AccountMeta(address: verifier, role: AccountRole.writableSigner),
    ];

    return TransactionInstruction(
      programAddress: programAddress,
      accounts: accounts,
      data: data,
    );
  }
}

/// Instruction for validating right of association (ROA) with Ethereum signatures
///
/// This instruction validates that a record owner has the right to associate
/// their domain with specific record data, using Ethereum secp256k1 signatures
/// for cross-chain validation.
class ValidateRoaEthereumInstruction {
  const ValidateRoaEthereumInstruction({
    required this.validation,
    required this.signature,
    required this.expectedPubkey,
  });

  /// Instruction tag (discriminator)
  static const int tag = 4;

  /// Validation type (should be Validation.ethereum = 2)
  final int validation;

  /// Ethereum signature bytes (65 bytes: r + s + v)
  final Uint8List signature;

  /// Expected Ethereum public key (64 bytes: uncompressed secp256k1)
  final Uint8List expectedPubkey;

  /// Serialize the instruction data using manual serialization
  Uint8List serialize() {
    // Calculate total size: tag (1) + validation (1) + signature array + expectedPubkey array
    final totalSize = 1 + 1 + 4 + signature.length + 4 + expectedPubkey.length;
    final result = Uint8List(totalSize);
    var offset = 0;

    // Write tag (u8)
    result[offset] = tag;
    offset += 1;

    // Write validation type (u8)
    result[offset] = validation;
    offset += 1;

    // Write signature array length (u32, little endian) + data
    final signatureLengthData = ByteData(4);
    signatureLengthData.setUint32(0, signature.length, Endian.little);
    result.setRange(
        offset, offset + 4, signatureLengthData.buffer.asUint8List());
    offset += 4;

    result.setRange(offset, offset + signature.length, signature);
    offset += signature.length;

    // Write expectedPubkey array length (u32, little endian) + data
    final pubkeyLengthData = ByteData(4);
    pubkeyLengthData.setUint32(0, expectedPubkey.length, Endian.little);
    result.setRange(offset, offset + 4, pubkeyLengthData.buffer.asUint8List());
    offset += 4;

    result.setRange(offset, offset + expectedPubkey.length, expectedPubkey);

    return result;
  }

  /// Create the Solana instruction for validate ROA Ethereum
  TransactionInstruction getInstruction({
    required String programAddress,
    required String systemProgram,
    required String splNameServiceProgram,
    required String feePayer,
    required String record,
    required String domain,
    required String domainOwner,
    required String centralState,
  }) {
    final data = serialize();

    final accounts = [
      AccountMeta(address: systemProgram, role: AccountRole.readonly),
      AccountMeta(address: splNameServiceProgram, role: AccountRole.readonly),
      AccountMeta(address: feePayer, role: AccountRole.writableSigner),
      AccountMeta(address: record, role: AccountRole.writable),
      AccountMeta(address: domain, role: AccountRole.writable),
      AccountMeta(address: domainOwner, role: AccountRole.writable),
      AccountMeta(address: centralState, role: AccountRole.readonly),
    ];

    return TransactionInstruction(
      programAddress: programAddress,
      accounts: accounts,
      data: data,
    );
  }
}
