import 'dart:typed_data';

import '../../sns_sdk.dart' show InvalidParentError;
import '../constants/addresses.dart';
import '../constants/records.dart';
import '../domain/get_domain_address.dart';
import '../errors/sns_errors.dart' show InvalidParentError;
import '../instructions/instruction_types.dart';
import '../instructions/validate_roa_ethereum_instruction.dart';
import '../instructions/validate_roa_instruction.dart';
import '../types/validation.dart';

/// Parameters for validating right of association (ROA)
class ValidateRoaParams {
  const ValidateRoaParams({
    required this.staleness,
    required this.domain,
    required this.record,
    required this.owner,
    required this.payer,
    required this.verifier,
  });

  /// Whether to perform staleness checking
  final bool staleness;

  /// The domain name
  final String domain;

  /// The record type to validate
  final Record record;

  /// The domain owner's address
  final String owner;

  /// The fee payer's address
  final String payer;

  /// The verifier's address (for staleness validation)
  final String verifier;
}

/// Parameters for validating ROA with Ethereum signatures
class ValidateRoaEthereumParams {
  const ValidateRoaEthereumParams({
    required this.domain,
    required this.record,
    required this.owner,
    required this.payer,
    required this.signature,
    required this.expectedPubkey,
  });

  /// The domain name
  final String domain;

  /// The record type to validate
  final Record record;

  /// The domain owner's address
  final String owner;

  /// The fee payer's address
  final String payer;

  /// The Ethereum signature (65 bytes: r + s + v)
  final Uint8List signature;

  /// The expected Ethereum public key (64 bytes uncompressed secp256k1)
  final Uint8List expectedPubkey;
}

/// Validates the right of association of a record using Pyth price feed validation.
///
/// This function creates an instruction to validate that a record owner has the
/// right to associate their domain with specific record data, with optional
/// staleness checking for price feed validation.
///
/// - [staleness]: Whether to perform staleness checking on the validation
/// - [domain]: The domain under which the record resides
/// - [record]: The type of record to validate
/// - [owner]: The address of the domain's owner
/// - [payer]: The address funding the validation process
/// - [verifier]: The address responsible for verifying the record
///
/// Returns a [TransactionInstruction] for the validate ROA operation.
///
/// Throws [InvalidParentError] if the parent domain could not be found.
Future<TransactionInstruction> validateRoa(ValidateRoaParams params) async {
  // Get domain address for the record
  final recordDomain = '${params.record.value}.${params.domain}';
  final domainResult = await getDomainAddress(GetDomainAddressParams(
    domain: recordDomain,
    record: RecordVersion.v2,
  ));

  var parentAddress = domainResult.parentAddress;

  // If it's a subdomain, get the parent domain address
  if (domainResult.isSub) {
    final parentResult =
        await getDomainAddress(GetDomainAddressParams(domain: params.domain));
    parentAddress = parentResult.domainAddress;
  }

  if (parentAddress == null) {
    throw Exception('Invalid parent: Parent could not be found');
  }

  // Create the validate ROA instruction
  final instruction = ValidateRoaInstruction(staleness: params.staleness);

  // Set the instruction parameters
  instruction.setParams(
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

  return instruction.build();
}

/// Validates the right of association of a record using Ethereum signatures.
///
/// This function creates an instruction to validate that a record owner has the
/// right to associate their domain with specific record data, using Ethereum
/// secp256k1 signatures for cross-chain validation.
///
/// - domain: The domain under which the record resides
/// - record: The type of record to validate
/// - owner: The address of the domain's owner
/// - payer: The address funding the validation process
/// - signature: The Ethereum signature used for validation (65 bytes)
/// - expectedPubkey: The expected Ethereum public key (64 bytes uncompressed)
///
/// Returns a [TransactionInstruction] for the validate ROA Ethereum operation.
///
/// Throws [InvalidParentError] if the parent domain could not be found.
Future<TransactionInstruction> validateRoaEthereum(
    ValidateRoaEthereumParams params) async {
  // Get domain address for the record
  final recordDomain = '${params.record.value}.${params.domain}';
  final domainResult = await getDomainAddress(GetDomainAddressParams(
    domain: recordDomain,
    record: RecordVersion.v2,
  ));

  var parentAddress = domainResult.parentAddress;

  // If it's a subdomain, get the parent domain address
  if (domainResult.isSub) {
    final parentResult =
        await getDomainAddress(GetDomainAddressParams(domain: params.domain));
    parentAddress = parentResult.domainAddress;
  }

  if (parentAddress == null) {
    throw Exception('Invalid parent: Parent could not be found');
  }

  // Create the validate ROA Ethereum instruction
  final instruction = ValidateRoaEthereumInstruction(
    validation: Validation.ethereum.value,
    signature: params.signature,
    expectedPubkey: params.expectedPubkey,
  );

  // Set the instruction parameters
  instruction.setParams(
    programAddress: recordsProgramAddress,
    systemProgram: systemProgramAddress,
    splNameServiceProgram: nameProgramAddress,
    feePayer: params.payer,
    record: domainResult.domainAddress,
    domain: parentAddress,
    domainOwner: params.owner,
    centralState: centralStateDomainRecords,
  );

  return instruction.build();
}
