import 'dart:typed_data';

import 'package:solana/solana.dart';

import '../constants/addresses.dart';
import '../constants/records.dart';
import '../errors/sns_errors.dart';
import '../instructions/instruction_types.dart';
import '../record_v2/serialize_record_v2_content.dart';
import '../utils/get_domain_key_sync.dart';

const createRecordV2InstructionTag = 2;

/// Creates a record V2 instruction with automatic serialization
///
/// This function mirrors js/src/bindings/createRecordV2Instruction.ts with strict parity
/// Handles the serialization of record data following SNS-IP 1 guidelines
///
/// [domain] - The .sol domain name
/// [record] - The record enum object
/// [content] - The content string that will be serialized into the record
/// [owner] - The owner of the domain
/// [payer] - The fee payer of the transaction
///
/// Returns a TransactionInstruction for creating the V2 record
///
/// Throws [InvalidParentError] if parent could not be found
Future<TransactionInstruction> createRecordV2Instruction(
  String domain,
  Record record,
  String content,
  Ed25519HDPublicKey owner,
  Ed25519HDPublicKey payer,
) async {
  // Get domain key information
  final domainKeyResult = await getDomainKeySync(
    '${record.value}.$domain',
    RecordVersion.v2,
  );

  var parent = domainKeyResult.parent != null
      ? Ed25519HDPublicKey.fromBase58(domainKeyResult.parent!)
      : null;

  // If this is a subdomain, get the parent domain key
  if (domainKeyResult.isSub) {
    final parentResult = await getDomainKeySync(domain);
    parent = Ed25519HDPublicKey.fromBase58(parentResult.pubkey);
  }

  if (parent == null) {
    throw InvalidParentError('Parent could not be found');
  }

  // Serialize the record content using V2 format
  final serializedContent = serializeRecordV2Content(content, record);

  // Create the record data with prefix
  final recordName = '\x02${record.value}';

  final instruction = TransactionInstruction(
    programAddress: nameProgramAddress,
    accounts: [
      AccountMeta.writableSigner(payer.toBase58()),
      AccountMeta.writable(
          Ed25519HDPublicKey.fromBase58(domainKeyResult.pubkey).toBase58()),
      AccountMeta.readonly(parent.toBase58()),
      AccountMeta.readonly(owner.toBase58()),
      AccountMeta.readonly(systemProgramAddress),
    ],
    data: _buildRecordV2InstructionData(recordName, serializedContent),
  );

  return instruction;
}

/// Helper function to build instruction data for create record V2
Uint8List _buildRecordV2InstructionData(
  String recordName,
  List<int> serializedContent,
) {
  final builder = BytesBuilder()..addByte(createRecordV2InstructionTag);

  // Add record name length and name
  final recordNameBytes = recordName.codeUnits;
  builder
    ..addByte(recordNameBytes.length)
    ..add(recordNameBytes)
    ..add(serializedContent);

  return builder.toBytes();
}
