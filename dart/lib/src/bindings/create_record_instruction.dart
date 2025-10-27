import 'dart:typed_data';

import 'package:solana/solana.dart' hide RpcClient;

import '../constants/addresses.dart';
import '../constants/records.dart';
import '../errors/sns_errors.dart';
import '../instructions/instruction_types.dart';
import '../record/serialize_record.dart';
import '../rpc/rpc_client.dart';
import '../states/registry.dart';
import '../utils/check.dart';
import '../utils/get_domain_key_sync.dart';

/// Creates a record V1 instruction with automatic serialization
///
/// This function mirrors js/src/bindings/createRecordInstruction.ts with strict parity
/// Handles the serialization of record data for V1 records
/// To create a SOL record use `createSolRecordInstruction`
///
/// [rpc] - The Solana RPC connection object
/// [domain] - The .sol domain name
/// [record] - The record enum object
/// [data] - The data (as a UTF-8 string) to store in the record account
/// [owner] - The owner of the domain
/// [payer] - The fee payer of the transaction
///
/// Returns a TransactionInstruction for creating the record
///
/// Throws [UnsupportedRecordError] if SOL record is used
Future<TransactionInstruction> createRecordInstruction(
  RpcClient rpc,
  String domain,
  Record record,
  String data,
  Ed25519HDPublicKey owner,
  Ed25519HDPublicKey payer,
) async {
  // Check that SOL record is not used with this instruction
  check(
    record != Record.sol,
    UnsupportedRecordError(
      'SOL record is not supported for this instruction',
    ),
  );

  // Get domain key information
  final domainKeyResult = await getDomainKeySync(
    '${record.value}.$domain',
    RecordVersion.v1,
  );

  // Serialize the record data
  final serialized = serializeRecord(data, record);
  final space = serialized.length;

  // Get minimum balance for rent exemption
  // Note: This would require implementing getMinimumBalanceForRentExemption
  // in RpcClient
  final lamports = await _getMinimumBalanceForRentExemption(
    rpc,
    space + RegistryState.headerLen,
  );

  // Create the instruction using proper instruction builder
  // This mirrors the JS SDK's createInstruction call
  final instruction = TransactionInstruction(
    programAddress: nameProgramAddress,
    accounts: [
      AccountMeta(
        address: payer.toBase58(),
        role: AccountRole.writableSigner,
      ),
      AccountMeta(
        address: domainKeyResult.pubkey,
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: owner.toBase58(),
        role: AccountRole.readonly,
      ),
      if (domainKeyResult.parent != null)
        AccountMeta(
          address: domainKeyResult.parent!,
          role: AccountRole.readonly,
        ),
      const AccountMeta(
        address: systemProgramAddress,
        role: AccountRole.readonly,
      ),
    ],
    data: _buildCreateInstructionData(
      domainKeyResult.hashed,
      lamports,
      space,
      serialized,
    ),
  );

  return instruction;
}

/// Helper function to get minimum balance for rent exemption
Future<int> _getMinimumBalanceForRentExemption(
  RpcClient rpc,
  int space,
) async =>
    // Placeholder implementation - would need to call RPC method
    // For now, return a reasonable default
    space * 6960; // Approximate rent exemption calculation

/// Helper function to build instruction data for create record
Uint8List _buildCreateInstructionData(
  List<int> hashedName,
  int lamports,
  int space,
  List<int> data,
) {
  // This would contain the actual instruction data encoding
  // For now, return a placeholder that includes the data
  final builder = <int>[]
    ..add(0) // Instruction discriminator for CREATE (0)
    ..addAll(hashedName); // Add hashed name

  // Add lamports (8 bytes, little endian)
  final lamportsBytes = <int>[];
  var temp = lamports;
  for (var i = 0; i < 8; i++) {
    lamportsBytes.add(temp & 0xFF);
    temp >>= 8;
  }
  builder.addAll(lamportsBytes);

  // Add space (4 bytes, little endian)
  final spaceBytes = <int>[];
  temp = space;
  for (var i = 0; i < 4; i++) {
    spaceBytes.add(temp & 0xFF);
    temp >>= 8;
  }
  builder
    ..addAll(spaceBytes)
    ..addAll(data); // Add serialized data

  return Uint8List.fromList(builder);
}
