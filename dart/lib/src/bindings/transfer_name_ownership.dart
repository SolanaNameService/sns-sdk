import 'package:solana/solana.dart' hide RpcClient;

import '../constants/addresses.dart';
import '../instructions/instruction_types.dart';
import '../instructions/transfer_instruction.dart';
import '../rpc/rpc_client.dart';
import '../states/registry.dart';
import '../utils/get_domain_key_sync.dart';

/// Parameters for transferring name ownership
class TransferNameOwnershipParams {
  const TransferNameOwnershipParams({
    required this.name,
    required this.newOwner,
    this.nameClass,
    this.nameParent,
    this.parentOwner,
  });

  /// The name of the name account
  final String name;

  /// The new owner to be set
  final Ed25519HDPublicKey newOwner;

  /// The class of this name, if it exists
  final Ed25519HDPublicKey? nameClass;

  /// The parent name of this name, if it exists
  final Ed25519HDPublicKey? nameParent;

  /// Parent name owner
  final Ed25519HDPublicKey? parentOwner;
}

/// Change the owner of a given name account.
///
/// This function mirrors js/src/bindings/transferNameOwnership.ts
///
/// [rpc] - The solana connection object to the RPC node
/// [params] - The parameters for transferring name ownership
///
/// Returns the transaction instruction for transferring name ownership
Future<TransactionInstruction> transferNameOwnership(
  RpcClient rpc,
  TransferNameOwnershipParams params,
) async {
  final result = await getDomainKeySync(params.name);

  Ed25519HDPublicKey currentNameOwner;
  if (params.nameClass != null) {
    currentNameOwner = params.nameClass!;
  } else {
    final state = await RegistryState.retrieve(rpc, result.pubkey);
    currentNameOwner = Ed25519HDPublicKey.fromBase58(state.owner);
  }

  final transferParams = TransferInstructionParams(
    newOwner: params.newOwner.toBase58(),
    programAddress: nameProgramAddress,
    domainAddress: result.pubkey,
    currentOwner: currentNameOwner.toBase58(),
    classAddress: params.nameClass?.toBase58(),
    parentAddress: params.nameParent?.toBase58(),
    parentOwner: params.parentOwner?.toBase58(),
  );

  final instruction = TransferInstruction(
    newOwner: params.newOwner.toBase58(),
    params: transferParams,
  );
  return instruction.build();
}
