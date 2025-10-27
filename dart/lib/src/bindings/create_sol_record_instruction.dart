import 'dart:typed_data';

import 'package:solana/solana.dart' hide RpcClient;

import '../constants/addresses.dart';
import '../constants/records.dart';
import '../instructions/instruction_types.dart';
import '../record/get_record_key_sync.dart';
import '../record/serialize_sol_record.dart';
import '../utils/get_domain_key_sync.dart';

/// Creates an instruction to create a SOL record
///
/// [domain] - The domain name to create the record for
/// [content] - The public key to store in the SOL record
/// [signer] - The domain owner who will sign the record
/// [signature] - The signature of the record content
/// [payer] - The account that will pay for the transaction
///
/// Returns a TransactionInstruction for creating the SOL record
Future<TransactionInstruction> createSolRecordInstruction({
  required String domain,
  required Ed25519HDPublicKey content,
  required Ed25519HDPublicKey signer,
  required Uint8List signature,
  required String payer,
}) async {
  // Get domain key information for SOL record
  final domainKeyResult = await getDomainKeySync(
    '${Record.sol.value}.$domain',
    RecordVersion.v1,
  );

  // Get the record key
  final recordKey = getRecordKeySync(domain, Record.sol);

  // Serialize the SOL record content with signature verification
  final serialized = await serializeSolRecord(
    content,
    Ed25519HDPublicKey.fromBase58(await recordKey),
    signer,
    signature,
  );

  // Create instruction data
  final instructionData = _buildSolRecordInstructionData(
    domainKeyResult.hashed,
    serialized,
  );

  // Build the transaction instruction
  final instruction = TransactionInstruction(
    programAddress: nameProgramAddress,
    accounts: [
      AccountMeta.writableSigner(payer),
      AccountMeta.writable(
          Ed25519HDPublicKey.fromBase58(domainKeyResult.pubkey).toBase58()),
      AccountMeta.readonlySigner(signer.toBase58()),
      if (domainKeyResult.parent != null)
        AccountMeta.readonly(
            Ed25519HDPublicKey.fromBase58(domainKeyResult.parent!).toBase58()),
      AccountMeta.readonly(systemProgramAddress),
    ],
    data: instructionData,
  );

  return instruction;
}

/// Helper function to build instruction data for SOL record creation
Uint8List _buildSolRecordInstructionData(
  List<int> hashedName,
  List<int> serializedRecord,
) {
  final builder = <int>[]
    ..add(0) // Instruction discriminator for CREATE (0)
    ..addAll(hashedName) // Add hashed name
    ..addAll(serializedRecord); // Add serialized SOL record data

  return Uint8List.fromList(builder);
}
