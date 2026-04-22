import '../constants/addresses.dart';
import '../instructions/delete_name_registry_instruction.dart';
import '../instructions/instruction_types.dart';
import '../instructions/transfer_instruction.dart';
import '../rpc/rpc_client.dart';
import '../utils/get_domain_key_sync.dart';
import 'create_reverse_twitter_registry.dart';

/// Change verified public key instruction
///
/// This function mirrors js/src/twitter/changeVerifiedPubkey.ts
///
/// Change the verified pubkey for a given twitter handle
/// Signed by the Authority, the verified pubkey and the payer
///
/// [connection] - RPC connection
/// [twitterHandle] - The Twitter handle
/// [currentVerifiedPubkey] - The current verified public key
/// [newVerifiedPubkey] - The new verified public key
/// [payerKey] - The payer's public key
///
/// Returns list of transaction instructions
Future<List<TransactionInstruction>> changeVerifiedPubkey(
  RpcClient connection,
  String twitterHandle,
  String currentVerifiedPubkey,
  String newVerifiedPubkey,
  String payerKey,
) async {
  final hashedTwitterHandle = getHashedNameSync(twitterHandle);
  final twitterHandleRegistryKey = getNameAccountKeySync(
    hashedTwitterHandle,
    nameParent: twitterRootParentRegistryAddress,
  );

  final instructions = <TransactionInstruction>[];

  // Transfer the user-facing registry ownership
  final transferInstr = TransferInstruction(
    newOwner: newVerifiedPubkey,
    params: TransferInstructionParams(
      newOwner: newVerifiedPubkey,
      programAddress: nameProgramAddress,
      domainAddress: await twitterHandleRegistryKey,
      currentOwner: currentVerifiedPubkey,
    ),
  );
  instructions.add(transferInstr.build());

  // Delete the old reverse registry
  final deleteInstr = DeleteNameRegistryInstruction();
  instructions.add(deleteInstr.getInstruction(
    programAddress: nameProgramAddress,
    domainAddress: await _getReverseRegistryKey(currentVerifiedPubkey),
    refundTarget: payerKey,
    owner: twitterVerificationAuthority,
  ));

  // Create the new reverse registry
  final reverseInstructions = await createReverseTwitterRegistry(
    connection,
    twitterHandle,
    await twitterHandleRegistryKey,
    newVerifiedPubkey,
    payerKey,
  );
  instructions.addAll(reverseInstructions);

  return instructions;
}

/// Get reverse registry key for a verified pubkey
Future<String> _getReverseRegistryKey(String verifiedPubkey) async {
  final hashedVerifiedPubkey = getHashedNameSync(verifiedPubkey);
  return getNameAccountKeySync(
    hashedVerifiedPubkey,
    nameClass: twitterVerificationAuthority,
    nameParent: twitterRootParentRegistryAddress,
  );
}
