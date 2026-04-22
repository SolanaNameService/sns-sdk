import '../constants/addresses.dart';
import '../constants/records.dart';
import '../domain/get_domain_address.dart';
import '../errors/sns_errors.dart';
import '../instructions/instruction_types.dart';
import '../instructions/validate_roa_instructions.dart';

/// Parameters for validating record V2 content
class ValidateRecordV2ContentParams {
  const ValidateRecordV2ContentParams({
    required this.staleness,
    required this.domain,
    required this.record,
    required this.owner,
    required this.payer,
    required this.verifier,
  });

  /// Whether to perform staleness checking
  final bool staleness;

  /// The domain under which the record will be validated
  final String domain;

  /// The type of record to be validated
  final Record record;

  /// The address of the domain's owner
  final String owner;

  /// The address funding the operation
  final String payer;

  /// The address that will verify the record
  final String verifier;
}

/// Validates record V2 content with Solana signature validation.
///
/// This function mirrors js/src/bindings/validateRecordV2Content.ts
Future<TransactionInstruction> validateRecordV2Content(
  ValidateRecordV2ContentParams params,
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

  final instruction = ValidateRoaInstruction(staleness: params.staleness);

  return instruction.getInstruction(
    programAddress: recordsProgramAddress,
    systemProgram: systemProgramAddress,
    splNameServiceProgram: nameProgramAddress,
    feePayer: params.payer,
    record: domainResult.domainAddress,
    domain: parentAddress,
    domainOwner: params.owner,
    centralState: centralStateDomainRecords,
    verifier: params.verifier,
  );
}
