import 'dart:typed_data';

import 'package:solana/solana.dart' hide RpcClient;

import '../constants/addresses.dart';
import '../constants/records.dart';
import '../domain/get_domain_address.dart';
import '../errors/sns_errors.dart';
import '../instructions/instruction_types.dart';
import '../instructions/validate_roa_ethereum_instruction.dart';

/// Parameters for Ethereum validation of record V2 content
class EthValidateRecordV2ContentParams {
  const EthValidateRecordV2ContentParams({
    required this.domain,
    required this.record,
    required this.owner,
    required this.payer,
    required this.signature,
    required this.expectedPubkey,
  });

  /// The .sol domain name
  final String domain;

  /// The record enum object
  final Record record;

  /// The owner of the record/domain
  final Ed25519HDPublicKey owner;

  /// The fee payer of the transaction
  final Ed25519HDPublicKey payer;

  /// Ethereum signature (65 bytes: r + s + v)
  final Uint8List signature;

  /// Expected Ethereum public key (64 bytes: uncompressed secp256k1)
  final Uint8List expectedPubkey;
}

/// Validates record V2 content with Ethereum signature
///
/// This function mirrors js/src/bindings/ethValidateRecordV2Content.ts
///
/// [params] - The parameters for Ethereum validation
///
/// Returns the Ethereum validation instruction
Future<TransactionInstruction> ethValidateRecordV2Content(
  EthValidateRecordV2ContentParams params,
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

  final instruction = ValidateRoaEthereumInstruction(
    validation: 2, // Validation.Ethereum = 2
    signature: params.signature,
    expectedPubkey: params.expectedPubkey,
  );

  instruction.setParams(
    programAddress: recordsProgramAddress,
    systemProgram: systemProgramAddress,
    splNameServiceProgram: nameProgramAddress,
    feePayer: params.payer.toBase58(),
    record: domainResult.domainAddress,
    domain: parentAddress,
    domainOwner: params.owner.toBase58(),
    centralState: centralStateDomainRecords,
  );

  return instruction.build();
}
