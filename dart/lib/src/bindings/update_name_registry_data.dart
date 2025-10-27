import 'dart:typed_data';

import 'package:solana/solana.dart' hide RpcClient;

import '../constants/addresses.dart';
import '../instructions/instruction_types.dart';
import '../instructions/update_name_registry_instruction.dart';
import '../rpc/rpc_client.dart';
import '../states/registry.dart';
import '../utils/get_domain_key_sync.dart';

/// Parameters for updating name registry data
class UpdateNameRegistryDataParams {
  const UpdateNameRegistryDataParams({
    required this.name,
    required this.offset,
    required this.inputData,
    this.nameClass,
    this.nameParent,
  });

  /// The name of the name registry to update
  final String name;

  /// The offset to which the data should be written into the registry
  final int offset;

  /// The data to be written
  final Uint8List inputData;

  /// The class of this name, if it exists
  final Ed25519HDPublicKey? nameClass;

  /// The parent name of this name, if it exists
  final Ed25519HDPublicKey? nameParent;
}

/// Overwrite the data of the given name registry.
///
/// This function mirrors js/src/bindings/updateNameRegistryData.ts
///
/// [rpc] - The solana connection object to the RPC node
/// [params] - The parameters for updating name registry data
///
/// Returns the transaction instruction for updating name registry data
Future<TransactionInstruction> updateNameRegistryData(
  RpcClient rpc,
  UpdateNameRegistryDataParams params,
) async {
  final result = await getDomainKeySync(params.name);

  Ed25519HDPublicKey signer;
  if (params.nameClass != null) {
    signer = params.nameClass!;
  } else {
    final state = await RegistryState.retrieve(rpc, result.pubkey);
    signer = Ed25519HDPublicKey.fromBase58(state.owner);
  }

  final instruction = UpdateNameRegistryInstruction(
    offset: params.offset,
    inputData: params.inputData,
  )..setParams(
      programAddress: nameProgramAddress,
      domainAddress: result.pubkey,
      signer: signer.toBase58(),
    );

  return instruction.build();
}
