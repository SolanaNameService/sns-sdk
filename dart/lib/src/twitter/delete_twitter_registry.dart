import '../constants/addresses.dart';
import '../instructions/delete_name_registry_instruction.dart';
import '../instructions/instruction_types.dart';
import '../utils/get_domain_key_sync.dart';

/// Delete Twitter registry instruction
///
/// This function mirrors js/src/twitter/deleteTwitterRegistry.ts
///
/// Delete the verified registry for a given Twitter handle.
/// Must be signed by the verified pubkey.
///
/// [twitterHandle] - The Twitter handle to delete the registry for
/// [verifiedPubkey] - The verified public key that owns the registry
///
/// Returns a list of transaction instructions
Future<List<TransactionInstruction>> deleteTwitterRegistry(
  String twitterHandle,
  String verifiedPubkey,
) async {
  // Hash the Twitter handle
  final hashedTwitterHandle = getHashedNameSync(twitterHandle);

  // Get the Twitter handle registry key
  final twitterHandleRegistryKey = getNameAccountKeySync(
    hashedTwitterHandle,
    nameParent: twitterRootParentRegistryAddress,
  );

  // Hash the verified pubkey for reverse registry
  final hashedVerifiedPubkey = getHashedNameSync(verifiedPubkey);

  // Get the reverse registry key
  final reverseRegistryKey = getNameAccountKeySync(
    hashedVerifiedPubkey,
    nameClass: twitterVerificationAuthority,
    nameParent: twitterRootParentRegistryAddress,
  );

  final instructions = <TransactionInstruction>[];

  // Delete the user facing registry
  final deleteUserFacingInstr = DeleteNameRegistryInstruction();
  instructions.add(deleteUserFacingInstr.getInstruction(
    programAddress: nameProgramAddress,
    domainAddress: await twitterHandleRegistryKey,
    refundTarget: verifiedPubkey,
    owner: verifiedPubkey,
  ));

  // Delete the reverse registry
  final deleteReverseInstr = DeleteNameRegistryInstruction();
  instructions.add(deleteReverseInstr.getInstruction(
    programAddress: nameProgramAddress,
    domainAddress: await reverseRegistryKey,
    refundTarget: verifiedPubkey,
    owner: verifiedPubkey,
  ));

  return instructions;
}
