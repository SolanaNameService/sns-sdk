import 'package:solana/solana.dart' hide RpcClient;

import '../constants/addresses.dart';
import '../constants/records.dart';
import '../domain/get_domain_address.dart';
import '../errors/sns_errors.dart';
import '../instructions/instruction_types.dart';
import '../instructions/update_record_instruction.dart';
import '../record_v2/serialize_record_v2_content.dart';

/// Parameters for updating a record V2
class UpdateRecordV2InstructionParams {
  const UpdateRecordV2InstructionParams({
    required this.domain,
    required this.record,
    required this.content,
    required this.owner,
    required this.payer,
  });

  /// The .sol domain name
  final String domain;

  /// The record enum object
  final Record record;

  /// The content to serialize into the record
  final String content;

  /// The owner of the record/domain
  final Ed25519HDPublicKey owner;

  /// The fee payer of the transaction
  final Ed25519HDPublicKey payer;
}

/// Updates the content of a record V2 following SNS-IP 1 guidelines
///
/// This function mirrors js/src/bindings/updateRecordV2Instruction.ts
///
/// [params] - The parameters for updating the record V2
///
/// Returns the update record instruction
Future<TransactionInstruction> updateRecordV2Instruction(
  UpdateRecordV2InstructionParams params,
) async {
  final domainResult = await getDomainAddress(
    GetDomainAddressParams(
      domain: '${params.record.value}.${params.domain}',
      record: RecordVersion.v2,
    ),
  );

  var parentAddress = domainResult.parentAddress;
  final isSub = domainResult.isSub;

  if (isSub) {
    final parentResult = await getDomainAddress(
      GetDomainAddressParams(domain: params.domain),
    );
    parentAddress = parentResult.domainAddress;
  }

  if (parentAddress == null) {
    throw InvalidParentError('Parent could not be found');
  }

  final serializedContent = serializeRecordV2Content(
    params.content,
    params.record,
  );

  final instruction = UpdateRecordInstruction(
    record: '\x02${params.record.value}',
    content: serializedContent,
    params: UpdateRecordInstructionParams(
      record: '\x02${params.record.value}',
      content: serializedContent,
      systemProgram: systemProgramAddress,
      splNameServiceProgram: nameProgramAddress,
      feePayer: params.payer.toBase58(),
      recordAddress: domainResult.domainAddress,
      domain: parentAddress,
      domainOwner: params.owner.toBase58(),
      centralState: centralStateDomainRecords,
      programAddress: recordsProgramAddress,
    ),
  );

  return instruction.build();
}
