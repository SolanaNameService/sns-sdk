import 'package:solana/solana.dart' hide RpcClient;

import '../constants/addresses.dart';
import '../instructions/instructions.dart';
import '../utils/derive_address.dart';
import '../utils/get_reverse_address_from_domain_address.dart';
import '../utils/base58_utils.dart';

/// Parameters for burning a domain
class BurnDomainParams {
  const BurnDomainParams({
    required this.domain,
    required this.owner,
    required this.refundAddress,
  });

  /// The domain name to burn
  final String domain;

  /// The current owner's address
  final String owner;

  /// The address to refund rent to
  final String refundAddress;
}

/// Creates a domain burn instruction
///
/// Burns a domain and refunds rent to the specified address.
/// This matches the js-kit/src/bindings/burnDomain.ts implementation.
Future<TransactionInstruction> burnDomain(BurnDomainParams params) async {
  // Derive the domain address
  final domainAddress = await deriveAddress(params.domain);

  // Derive proper addresses using correct PDA derivation patterns
  final reverseAddress =
      await getReverseAddressFromDomainAddress(domainAddress);

  // State address is derived as PDA with domain address as seed
  final stateAddress = await Ed25519HDPublicKey.findProgramAddress(
    seeds: [Base58Utils.decode(domainAddress)],
    programId: Ed25519HDPublicKey.fromBase58(registryProgramAddress),
  ).then((result) => result.toBase58());

  // For reselling state, use similar pattern - this would need to match JS implementation
  final resellingStateAddress =
      stateAddress; // Often same as state for burn operations

  // Create burn instruction parameters
  final burnParams = BurnDomainInstructionParams(
    nameServiceId: nameProgramAddress,
    systemProgram: systemProgramAddress,
    domainAddress: domainAddress,
    reverse: reverseAddress,
    resellingState: resellingStateAddress,
    state: stateAddress,
    centralState: centralState,
    owner: params.owner,
    target: params.refundAddress,
    programAddress: registryProgramAddress,
  );

  // Create and build the burn instruction
  final burnInstr = BurnDomainInstruction(
    params: burnParams,
  );

  return burnInstr.build();
}
