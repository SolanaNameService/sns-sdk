import 'dart:typed_data';
import 'package:solana/base58.dart';

import '../constants/addresses.dart';
import '../instructions/instruction_types.dart';
import '../instructions/update_name_registry_instruction.dart';
import '../int.dart';
import '../rpc/rpc_client.dart';
import '../utils/get_domain_key_sync.dart';
import 'reverse_twitter_registry_state.dart';

/// Create reverse Twitter registry instruction
///
/// This function mirrors js/src/twitter/createReverseTwitterRegistry.ts
///
/// [connection] - RPC connection
/// [twitterHandle] - The Twitter handle
/// [twitterRegistryKey] - The Twitter registry key
/// [verifiedPubkey] - The verified public key
/// [payerKey] - The payer's public key
///
/// Returns list of transaction instructions
Future<List<TransactionInstruction>> createReverseTwitterRegistry(
  RpcClient connection,
  String twitterHandle,
  String twitterRegistryKey,
  String verifiedPubkey,
  String payerKey,
) async {
  // Create the reverse lookup registry
  final hashedVerifiedPubkey = getHashedNameSync(verifiedPubkey);
  final reverseRegistryKey = getNameAccountKeySync(
    hashedVerifiedPubkey,
    nameClass: twitterVerificationAuthority,
    nameParent: twitterRootParentRegistryAddress,
  );

  // Create the reverse Twitter registry state
  final reverseState = ReverseTwitterRegistryState(
    twitterRegistryKey: _publicKeyToBytes(twitterRegistryKey),
    twitterHandle: twitterHandle,
  );
  final reverseTwitterRegistryStateBuff = reverseState.serialize();

  // Calculate rent exemption for the account
  // This mirrors the JavaScript SDK's getMinimumBalanceForRentExemption call
  // Using approximate calculation similar to other instructions in the codebase
  final accountSize = reverseTwitterRegistryStateBuff.length +
      96; // NameRegistryState.HEADER_LEN equivalent
  final rentExemptionLamports =
      accountSize * 6960; // Approximate rent exemption calculation

  final instructions = <TransactionInstruction>[];

  // Create instruction matching JavaScript SDK's createInstruction call
  final createInstruction = TransactionInstruction(
    programAddress: nameProgramAddress,
    accounts: [
      const AccountMeta(
        address: systemProgramAddress,
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: payerKey,
        role: AccountRole.writableSigner,
      ),
      AccountMeta(
        address: await reverseRegistryKey,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: verifiedPubkey,
        role: AccountRole.readonly,
      ),
      // Optional class key (Twitter verification authority)
      const AccountMeta(
        address: twitterVerificationAuthority,
        role: AccountRole.readonlySigner,
      ),
      // Parent key
      const AccountMeta(
        address: twitterRootParentRegistryAddress,
        role: AccountRole.readonly,
      ),
      // Parent owner (Twitter verification authority)
      const AccountMeta(
        address: twitterVerificationAuthority,
        role: AccountRole.readonlySigner,
      ),
    ],
    data: _buildCreateInstructionData(
      hashedVerifiedPubkey,
      rentExemptionLamports,
      reverseTwitterRegistryStateBuff.length,
    ),
  );
  instructions.add(createInstruction);

  // Create the update instruction to write the reverse state data
  final updateInstr = UpdateNameRegistryInstruction(
    offset: 0,
    inputData: reverseTwitterRegistryStateBuff,
  );

  final updateInstruction = updateInstr.getInstruction(
    programAddress: nameProgramAddress,
    domainAddress: await reverseRegistryKey,
    signer: twitterVerificationAuthority,
  );
  instructions.add(updateInstruction);

  return instructions;
}

/// Convert public key string to bytes using robust base58 decoding
///
/// This mirrors the JavaScript SDK's PublicKey.toBytes() functionality
/// by properly decoding base58-encoded public keys to their 32-byte representation.
Uint8List _publicKeyToBytes(String pubkey) {
  try {
    // Use the base58 decoding from the solana package
    return Uint8List.fromList(base58decode(pubkey));
  } catch (e) {
    throw ArgumentError('Invalid public key format: $pubkey - $e');
  }
}

/// Build create instruction data matching JavaScript SDK implementation
///
/// This mirrors js/src/instructions/createInstruction.ts format:
/// [0] - Instruction tag (0 for create)
/// [1-4] - Hashed name length (u32, little-endian)
/// [5-36] - Hashed name (32 bytes)
/// [37-44] - Lamports (u64, little-endian) - calculated from rent exemption
/// [45-48] - Space (u32, little-endian) - size of reverse registry state
Uint8List _buildCreateInstructionData(
  Uint8List hashedName,
  int lamports,
  int space,
) {
  final data = <int>[
    // Instruction tag (0 for create)
    0,
  ];

  // Add hashed name length (4 bytes, little-endian)
  final nameLength = Numberu32(hashedName.length);
  data.addAll(nameLength.toBuffer());

  // Add hashed name (32 bytes)
  data.addAll(hashedName);

  // Add lamports (8 bytes, little-endian)
  final lamportsBuffer = Numberu64(lamports);
  data.addAll(lamportsBuffer.toBuffer());

  // Add space (4 bytes, little-endian)
  final spaceBuffer = Numberu32(space);
  data.addAll(spaceBuffer.toBuffer());

  return Uint8List.fromList(data);
}
