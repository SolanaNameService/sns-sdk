import '../constants/addresses.dart';
import '../constants/records.dart';
import '../domain/get_domain_address.dart';
import '../errors/sns_errors.dart';
import '../instructions/allocate_and_post_record_instruction.dart';
import '../instructions/instruction_types.dart';
import '../utils/serializers/serialize_record_content.dart';

/// Parameters for creating a record
class CreateRecordParams {
  const CreateRecordParams({
    required this.domain,
    required this.record,
    required this.content,
    required this.owner,
    required this.payer,
  });

  /// The domain under which the record will be created
  final String domain;

  /// The type of record to be created
  final Record record;

  /// The record content
  final String content;

  /// The address of the domain's owner
  final String owner;

  /// The address funding the record creation
  final String payer;
}

/// Creates a record for the specified domain. The record data will be
/// serialized in compliance with the SNS-IP 1 guidelines.
///
/// This mirrors js-kit/src/bindings/createRecord.ts
Future<TransactionInstruction> createRecord(CreateRecordParams params) async {
  final domainResult = await getDomainAddress(
    GetDomainAddressParams(
      domain: '${params.record.value}.'
          '${params.domain}',
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

  final recordContent = serializeRecordContent(
    content: params.content,
    record: params.record,
  );

  final instruction = AllocateAndPostRecordInstruction(
    record: '\x02${params.record.value}',
    content: recordContent,
  )..setParams(
      programAddress: recordsProgramAddress,
      systemProgram: systemProgramAddress,
      splNameServiceProgram: nameProgramAddress,
      payer: params.payer,
      recordAddress: domainResult.domainAddress,
      domainAddress: parentAddress,
      domainOwner: params.owner,
      centralState: centralStateDomainRecords,
    );

  return instruction.build();
}
