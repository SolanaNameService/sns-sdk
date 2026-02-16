import 'dart:typed_data';

import 'package:solana/solana.dart' hide RpcClient;

import '../constants/addresses.dart';
import '../constants/records.dart';
import '../errors/sns_errors.dart';
import '../instructions/delete_name_registry_instruction.dart';
import '../instructions/instruction_types.dart';
import '../instructions/update_name_registry_instruction.dart';
import '../record/serialize_sol_record.dart';
import '../rpc/rpc_client.dart';
import '../utils/get_domain_key_sync.dart';
import 'create_sol_record_instruction.dart';

/// Updates a SOL record for a domain
///
/// This function mirrors the JavaScript SDK's updateSolRecordInstruction
/// It handles the delete-and-recreate pattern for SOL records
///
/// [connection] - The RPC client for account info
/// [domain] - The domain name to update the SOL record for
/// [content] - The new public key to store in the SOL record
/// [signer] - The domain owner who will sign the record
/// [signature] - The signature of the new record content
/// [payer] - The account that will pay for transaction fees
///
/// Returns a List<TransactionInstruction> for updating the SOL record
Future<List<TransactionInstruction>> updateSolRecordInstruction({
  required RpcClient connection,
  required String domain,
  required Ed25519HDPublicKey content,
  required Ed25519HDPublicKey signer,
  required Uint8List signature,
  required Ed25519HDPublicKey payer,
}) async {
  // Get domain key information for SOL record - following JS exactly
  final domainKeyResult = await getDomainKeySync(
    '${Record.sol.value}.$domain',
    RecordVersion.v1,
  );
  final pubkey = Ed25519HDPublicKey.fromBase58(domainKeyResult.pubkey);

  // Check if record account exists
  final info = await connection.fetchEncodedAccount(pubkey.toBase58());
  if (!info.exists || info.data.isEmpty) {
    throw SnsError(
      ErrorType.accountDoesNotExist,
      'The record account does not exist',
    );
  }

  // Check data length - if not 96 bytes, need to delete and recreate
  if (info.data.length != 96) {
    // Return delete + create instructions
    final deleteIx = DeleteNameRegistryInstruction();
    deleteIx.setParams(
      programAddress: nameProgramAddress,
      domainAddress: pubkey.toBase58(),
      refundTarget: payer.toBase58(),
      owner: signer.toBase58(),
    );

    final createIx = await createSolRecordInstruction(
      domain: domain,
      content: content,
      signer: signer,
      signature: signature,
      payer: payer.toBase58(),
    );

    return [deleteIx.build(), createIx];
  }

  // Serialize the SOL record data
  final serialized = await serializeSolRecord(
    content,
    pubkey,
    signer,
    signature,
  );

  // Create update instruction using UpdateNameRegistryInstruction
  final updateIx = UpdateNameRegistryInstruction(
    offset: 0,
    inputData: serialized,
  );
  updateIx.setParams(
    programAddress: nameProgramAddress,
    domainAddress: pubkey.toBase58(),
    signer: signer.toBase58(),
  );

  return [updateIx.build()];
}
