import 'package:solana/solana.dart' hide RpcClient;

import '../constants/addresses.dart';
import '../instructions/delete_name_registry_instruction.dart';
import '../instructions/instruction_types.dart';
import '../rpc/rpc_client.dart';
import '../states/registry.dart';
import '../utils/get_domain_key_sync.dart';

/// Parameters for deleting a name registry
class DeleteNameRegistryParams {
  const DeleteNameRegistryParams({
    required this.name,
    required this.refundTargetKey,
    this.nameClass,
    this.nameParent,
  });

  /// The name of the name account
  final String name;

  /// The refund destination address
  final Ed25519HDPublicKey refundTargetKey;

  /// The class of this name, if it exists
  final Ed25519HDPublicKey? nameClass;

  /// The parent name of this name, if it exists
  final Ed25519HDPublicKey? nameParent;
}

/// Delete the name account and transfer the rent to the target.
///
/// This function mirrors js/src/bindings/deleteNameRegistry.ts
///
/// [rpc] - The solana connection object to the RPC node
/// [params] - The parameters for deleting the name registry
///
/// Returns the transaction instruction for deleting the name registry
Future<TransactionInstruction> deleteNameRegistry(
  RpcClient rpc,
  DeleteNameRegistryParams params,
) async {
  final result = getDomainKeySync(params.name);

  Ed25519HDPublicKey nameOwner;
  if (params.nameClass != null) {
    nameOwner = params.nameClass!;
  } else {
    final domainKeyResult = await result;
    final state = await RegistryState.retrieve(rpc, domainKeyResult.pubkey);
    nameOwner = Ed25519HDPublicKey.fromBase58(state.owner);
  }

  final domainKeyResult = await result;
  final instruction = DeleteNameRegistryInstruction()
    ..setParams(
      programAddress: nameProgramAddress,
      domainAddress: domainKeyResult.pubkey,
      refundTarget: params.refundTargetKey.toBase58(),
      owner: nameOwner.toBase58(),
    );

  return instruction.build();
}
