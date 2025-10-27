import '../constants/addresses.dart';
import '../instructions/instructions.dart';
import '../utils/derive_address.dart';

/// Parameters for transferring a domain
class TransferDomainParams {
  const TransferDomainParams({
    required this.domain,
    required this.newOwner,
    this.classAddress,
    this.parentAddress,
    this.parentOwner,
  });

  /// The domain name to transfer
  final String domain;

  /// The new owner's address (as base58 string)
  final String newOwner;

  /// Optional class address for the domain
  final String? classAddress;

  /// Optional parent address
  final String? parentAddress;

  /// Optional parent owner address
  final String? parentOwner;
}

/// Creates a domain transfer instruction
///
/// Transfers ownership of a domain from the current owner to a new owner.
/// This matches the js-kit/src/bindings/transferDomain.ts implementation.
Future<TransactionInstruction> transferDomain(
    TransferDomainParams params) async {
  // Derive the domain address
  final domainAddress = await deriveAddress(
    params.domain,
    parentAddress: params.parentAddress,
    classAddress: params.classAddress,
  );

  // Use the provided current owner or default to domain address for registry owner
  final currentOwner = params.classAddress ?? domainAddress;

  // Create transfer instruction parameters
  final transferParams = TransferInstructionParams(
    newOwner: params.newOwner,
    programAddress: nameProgramAddress,
    domainAddress: domainAddress,
    currentOwner: currentOwner,
    classAddress: params.classAddress,
    parentAddress: params.parentAddress,
    parentOwner: params.parentOwner,
  );

  // Create and build the transfer instruction
  final transferInstr = TransferInstruction(
    newOwner: params.newOwner,
    params: transferParams,
  );

  return transferInstr.build();
}
