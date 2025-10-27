import 'package:solana/solana.dart' hide RpcClient;

import '../constants/addresses.dart';
import '../constants/records.dart';
import '../domain/get_domain_address.dart';
import '../errors/sns_errors.dart';
import '../instructions/delete_record_instruction.dart';
import '../instructions/instruction_types.dart';

/// Parameters for deleting a record V2
class DeleteRecordV2Params {
  const DeleteRecordV2Params({
    required this.domain,
    required this.record,
    required this.owner,
    required this.payer,
  });

  /// The .sol domain name
  final String domain;

  /// The record type enum
  final Record record;

  /// The owner of the record to delete
  final Ed25519HDPublicKey owner;

  /// The fee payer of the transaction
  final Ed25519HDPublicKey payer;
}

/// Deletes a record V2 and returns the rent to the fee payer
///
/// This function mirrors js/src/bindings/deleteRecordV2.ts
///
/// [params] - The parameters for deleting the record V2
///
/// Returns the delete transaction instruction
Future<TransactionInstruction> deleteRecordV2(
  DeleteRecordV2Params params,
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

  final instruction = DeleteRecordInstruction(
    params: DeleteRecordInstructionParams(
      systemProgram: systemProgramAddress,
      splNameServiceProgram: nameProgramAddress,
      payer: params.payer.toBase58(),
      record: domainResult.domainAddress,
      domainAddress: parentAddress,
      domainOwner: params.owner.toBase58(),
      centralState: centralStateDomainRecords,
      programAddress: recordsProgramAddress,
    ),
  );

  return instruction.build();
}
