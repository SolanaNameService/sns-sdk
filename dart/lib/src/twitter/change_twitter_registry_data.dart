import 'dart:typed_data';

import '../constants/addresses.dart';
import '../instructions/instruction_types.dart';
import '../instructions/update_name_registry_instruction.dart';
import '../utils/get_domain_key_sync.dart';

/// Change Twitter registry data instruction
///
/// This function mirrors js/src/twitter/changeTwitterRegistryData.ts
///
/// Overwrites the data that is written in the user facing registry.
/// Must be signed by the verified pubkey.
///
/// [twitterHandle] - The Twitter handle to update data for
/// [verifiedPubkey] - The verified public key that can update the registry
/// [offset] - The offset at which to write the input data into the NameRegistryData
/// [inputData] - The new data to write
///
/// Returns a list of transaction instructions
Future<List<TransactionInstruction>> changeTwitterRegistryData(
  String twitterHandle,
  String verifiedPubkey,
  int offset,
  Uint8List inputData,
) async {
  // Hash the Twitter handle
  final hashedTwitterHandle = getHashedNameSync(twitterHandle);

  // Get the Twitter handle registry key using the name account key derivation
  final twitterHandleRegistryKey = await getNameAccountKeySync(
    hashedTwitterHandle,
    nameParent: twitterRootParentRegistryAddress,
  );

  // Create the update instruction
  final updateInstr = UpdateNameRegistryInstruction(
    offset: offset,
    inputData: inputData,
  );

  final instruction = updateInstr.getInstruction(
    programAddress: nameProgramAddress,
    domainAddress: twitterHandleRegistryKey,
    signer: verifiedPubkey,
  );

  return [instruction];
}
