import 'dart:typed_data';

import '../constants/addresses.dart';
import '../constants/records.dart';
import '../domain/get_domain_address.dart';
import '../errors/sns_errors.dart';
import '../instructions/instruction_types.dart';
import '../instructions/write_roa_instruction.dart';

/// Parameters for writing Right of Association (RoA)
class WriteRoaParams {
  const WriteRoaParams({
    required this.domain,
    required this.record,
    required this.owner,
    required this.payer,
    required this.roaId,
  });

  /// The domain under which the record will be written
  final String domain;

  /// The type of record to be written
  final Record record;

  /// The address of the domain's owner
  final String owner;

  /// The address funding the operation
  final String payer;

  /// The identifier for the RoA as address bytes
  final Uint8List roaId;
}

/// Writes a ROA (Right of association) in a record.
///
/// This mirrors js-kit/src/bindings/writeRoa.ts
Future<TransactionInstruction> writeRoa(WriteRoaParams params) async {
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

  final instruction = WriteRoaInstruction(roaId: params.roaId);

  return instruction.getInstruction(
    programAddress: recordsProgramAddress,
    systemProgram: systemProgramAddress,
    splNameServiceProgram: nameProgramAddress,
    feePayer: params.payer,
    record: domainResult.domainAddress,
    domain: parentAddress,
    domainOwner: params.owner,
    centralState: centralStateDomainRecords,
  );
}
