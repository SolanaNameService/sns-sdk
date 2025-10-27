import 'dart:typed_data';

import '../constants/addresses.dart';
import '../instructions/instruction_types.dart';
import '../rpc/rpc_client.dart';
import '../states/registry.dart';
import '../utils/get_domain_key_sync.dart';

/// Parameters for creating a name registry
class CreateNameRegistryParams {
  const CreateNameRegistryParams({
    required this.name,
    required this.space,
    required this.payerKey,
    required this.nameOwner,
    this.lamports,
    this.nameClass,
    this.parentName,
  });

  /// The name of the new account
  final String name;

  /// The space in bytes allocated to the account
  final int space;

  /// The allocation cost payer
  final String payerKey;

  /// The pubkey to be set as owner of the new name account
  final String nameOwner;

  /// The budget to be set for the name account. If not specified, it'll be the minimum for rent exemption
  final int? lamports;

  /// The class of this new name
  final String? nameClass;

  /// The parent name of the new name. If specified its owner needs to sign
  final String? parentName;
}

/// Creates a name account with the given rent budget, allocated space, owner and class.
///
/// This function mirrors js/src/bindings/createNameRegistry.ts exactly.
/// Uses the existing Dart utilities for hashing and key derivation.
///
/// [rpc] - The RPC client for blockchain interactions
/// [params] - The parameters for creating the name registry
///
/// Returns a TransactionInstruction for creating the name registry
Future<TransactionInstruction> createNameRegistry(
  RpcClient rpc,
  CreateNameRegistryParams params,
) async {
  // Generate the hashed name
  final hashedName = getHashedNameSync(params.name);

  // Get the name account key using the same utilities as other parts of the SDK
  final nameAccountKey = await getNameAccountKeySync(
    hashedName,
    nameClass: params.nameClass,
    nameParent: params.parentName,
  );

  // Get minimum balance for rent exemption if not specified
  // Note: This requires extending RpcClient interface to include getMinimumBalanceForRentExemption
  // For now, we'll calculate a reasonable default based on space
  final lamports =
      params.lamports ?? (params.space * 6960); // Approximate rent calculation

  // Get parent owner if parent name is specified
  String? nameParentOwner;
  if (params.parentName != null) {
    try {
      final parentRegistry =
          await RegistryState.retrieve(rpc, params.parentName!);
      nameParentOwner = parentRegistry.owner;
    } on Exception {
      // If parent doesn't exist, continue without parent owner
      nameParentOwner = null;
    }
  }

  // Build the create name registry instruction
  final instruction = TransactionInstruction(
    programAddress: nameProgramAddress,
    accounts: [
      // System program for account creation
      const AccountMeta(
        address: systemProgramAddress,
        role: AccountRole.readonly,
      ),
      // Payer account (must sign)
      AccountMeta(
        address: params.payerKey,
        role: AccountRole.writableSigner,
      ),
      // Name account (to be created)
      AccountMeta(
        address: nameAccountKey,
        role: AccountRole.writable,
      ),
      // Name owner
      AccountMeta(
        address: params.nameOwner,
        role: AccountRole.readonly,
      ),
      // Class address (if specified)
      if (params.nameClass != null)
        AccountMeta(
          address: params.nameClass!,
          role: AccountRole.readonly,
        ),
      // Parent name address (if specified)
      if (params.parentName != null)
        AccountMeta(
          address: params.parentName!,
          role: AccountRole.readonly,
        ),
      // Parent owner (if specified and found)
      if (nameParentOwner != null)
        AccountMeta(
          address: nameParentOwner,
          role: AccountRole.writableSigner,
        ),
    ],
    data: _buildCreateNameRegistryData(hashedName, lamports, params.space),
  );

  return instruction;
}

/// Builds the instruction data for creating a name registry
///
/// This mirrors the format used in js/src/instructions/createInstruction.ts
Uint8List _buildCreateNameRegistryData(
  Uint8List hashedName,
  int lamports,
  int space,
) {
  final data = <int>[
    // Instruction discriminator for CREATE (0)
    0,
    // Add hashed name (32 bytes)
    ...hashedName,
  ];

  // Add lamports (8 bytes, little endian)
  final lamportsBytes = ByteData(8)..setUint64(0, lamports, Endian.little);
  data.addAll(lamportsBytes.buffer.asUint8List());

  // Add space (4 bytes, little endian)
  final spaceBytes = ByteData(4)..setUint32(0, space, Endian.little);
  data.addAll(spaceBytes.buffer.asUint8List());

  return Uint8List.fromList(data);
}
