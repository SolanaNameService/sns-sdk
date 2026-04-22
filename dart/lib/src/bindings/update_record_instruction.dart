import 'package:solana/solana.dart' hide RpcClient;

import '../constants/addresses.dart';
import '../constants/records.dart';
import '../errors/sns_errors.dart';
import '../instructions/delete_name_registry_instruction.dart';
import '../instructions/update_name_registry_instruction.dart';
import '../record/serialize_record.dart';
import '../rpc/rpc_client.dart';
import '../utils/check.dart';
import '../utils/get_domain_key_sync.dart';
import 'create_record_instruction.dart';

/// Updates a record V1 instruction with automatic serialization
///
/// This function mirrors js/src/bindings/updateRecordInstruction.ts with strict parity
/// Handles updating existing record data, or delete/recreate if size changed
///
/// [connection] - The Solana RPC connection object
/// [domain] - The .sol domain name
/// [record] - The record enum object
/// [data] - The new data (as a UTF-8 string) to store in the record account
/// [owner] - The owner of the domain
/// [payer] - The fee payer of the transaction
///
/// Returns either a single update instruction or [delete, create] instructions
///
/// Throws [UnsupportedRecordError] if SOL record is used
/// Throws [AccountDoesNotExistError] if record account doesn't exist
Future<dynamic> updateRecordInstruction(
  RpcClient connection,
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
    '${record.name}.$domain',
    RecordVersion.v1,
  );

  // Check if account exists
  final accountInfo = await connection.fetchEncodedAccount(
    domainKeyResult.pubkey,
  );

  check(
    accountInfo.exists && accountInfo.data.isNotEmpty,
    AccountDoesNotExistError('The record account does not exist'),
  );

  // Serialize the new record data
  final serialized = serializeRecord(data, record);

  // Check if data size changed (after NAME_REGISTRY_LEN offset)
  final existingDataLength =
      accountInfo.data.length - 96; // NAME_REGISTRY_LEN = 96

  if (existingDataLength != serialized.length) {
    // Delete + create until we can realloc accounts
    final deleteIx = deleteNameRegistryInstruction(
      Ed25519HDPublicKey.fromBase58(nameProgramAddress),
      Ed25519HDPublicKey.fromBase58(domainKeyResult.pubkey),
      payer,
      owner,
    );

    final createIx = await createRecordInstruction(
      connection,
      domain,
      record,
      data,
      owner,
      payer,
    );

    return [deleteIx, createIx];
  }

  // Size unchanged, use update instruction
  final updateIx = updateNameRegistryInstruction(
    Ed25519HDPublicKey.fromBase58(nameProgramAddress),
    Ed25519HDPublicKey.fromBase58(domainKeyResult.pubkey),
    0, // offset
    serialized,
    owner,
  );

  return updateIx;
}
