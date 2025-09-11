import 'dart:typed_data';

import '../constants/addresses.dart';
import '../instructions/instruction_types.dart';
import '../int.dart';
import '../rpc/rpc_client.dart';
import '../utils/get_domain_key_sync.dart';
import 'create_reverse_twitter_registry.dart';

/// Create verified Twitter registry instruction
///
/// This function mirrors js/src/twitter/createVerifiedTwitterRegistry.ts
///
/// Signed by the authority, the payer and the verified pubkey
///
/// [connection] - RPC connection
/// [twitterHandle] - The Twitter handle
/// [verifiedPubkey] - The verified public key
/// [space] - The space that the user will have to write data into the verified registry
/// [payerKey] - The payer's public key
///
/// Returns list of transaction instructions
Future<List<TransactionInstruction>> createVerifiedTwitterRegistry(
  RpcClient connection,
  String twitterHandle,
  String verifiedPubkey,
  int space,
  String payerKey,
) async {
  // Create user facing registry
  final hashedTwitterHandle = getHashedNameSync(twitterHandle);
  final twitterHandleRegistryKey = getNameAccountKeySync(
    hashedTwitterHandle,
    nameParent: twitterRootParentRegistryAddress,
  );

  // Calculate rent exemption for the account
  // This mirrors the JavaScript SDK's getMinimumBalanceForRentExemption call
  // Using approximate calculation similar to other instructions in the codebase
  final accountSize =
      space + 96; // space + NameRegistryState.HEADER_LEN equivalent
  final rentExemptionLamports =
      accountSize * 6960; // Approximate rent exemption calculation

  final instructions = <TransactionInstruction>[];

  // Create the main user-facing registry instruction matching JavaScript SDK's createInstruction
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
        address: await twitterHandleRegistryKey,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: verifiedPubkey,
        role: AccountRole.readonly,
      ),
      // Optional class key - unused for user-facing registries
      const AccountMeta(
        address:
            '11111111111111111111111111111111', // PublicKey(Buffer.alloc(32)) equivalent
        role: AccountRole.readonly,
      ),
      // Parent key
      const AccountMeta(
        address: twitterRootParentRegistryAddress,
        role: AccountRole.readonly,
      ),
      // Parent owner (Twitter verification authority acts as owner of the parent)
      const AccountMeta(
        address: twitterVerificationAuthority,
        role: AccountRole.readonlySigner,
      ),
    ],
    data: _buildCreateInstructionData(
        hashedTwitterHandle, rentExemptionLamports, space),
  );
  instructions.add(createInstruction);

  // Create the reverse Twitter registry
  final reverseInstructions = await createReverseTwitterRegistry(
    connection,
    twitterHandle,
    await twitterHandleRegistryKey,
    verifiedPubkey,
    payerKey,
  );
  instructions.addAll(reverseInstructions);

  return instructions;
}

/// Build create instruction data matching JavaScript SDK implementation
///
/// This mirrors js/src/instructions/createInstruction.ts format:
/// [0] - Instruction tag (0 for create)
/// [1-4] - Hashed name length (u32, little-endian)
/// [5-36] - Hashed name (32 bytes)
/// [37-44] - Lamports (u64, little-endian)
/// [45-48] - Space (u32, little-endian)
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
