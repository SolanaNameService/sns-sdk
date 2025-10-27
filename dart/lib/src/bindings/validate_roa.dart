import '../constants/addresses.dart';
import '../constants/records.dart';
import '../domain/get_domain_address.dart';
import '../errors/sns_errors.dart';
import '../instructions/instruction_types.dart';
import '../instructions/validate_roa_instruction.dart';

/// Parameters for validating Right of Association (RoA)
class ValidateRoaParams {
  const ValidateRoaParams({
    required this.staleness,
    required this.domain,
    required this.record,
    required this.owner,
    required this.payer,
    required this.verifier,
  });

  /// Indicates whether the record validation is stale
  final bool staleness;

  /// The domain under which the record resides
  final String domain;

  /// The type of record to validate
  final Record record;

  /// The address of the domain's owner
  final String owner;

  /// The address funding the validation process
  final String payer;

  /// The address responsible for verifying the record
  final String verifier;
}

/// Validates the right of association of a record.
///
/// This mirrors js-kit/src/bindings/validateRoa.ts
Future<TransactionInstruction> validateRoa(ValidateRoaParams params) async {
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
