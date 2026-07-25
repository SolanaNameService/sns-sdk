import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import {
  NAME_PROGRAM_ID,
  TWITTER_VERIFICATION_AUTHORITY,
  TWITTER_ROOT_PARENT_REGISTRY_KEY,
} from "../constants";
import { deleteInstruction } from "../instructions/deleteInstruction";
import { getHashedNameSync } from "../utils/getHashedNameSync";
import { getNameAccountKeySync } from "../utils/getNameAccountKeySync";

/**
 * Builds instructions to delete a verified Twitter handle registry and reverse registry.
 *
 * The verified public key must sign the resulting instructions.
 *
 * @param twitterHandle Verified Twitter handle whose registries are deleted.
 * @param verifiedPubkey Signer that owns both registries and receives their lamports.
 * @returns Instructions that delete the user-facing and reverse registries.
 *
 * @example
 * ```ts
 * const instructions = await deleteTwitterRegistry("bonfida", owner);
 * ```
 */
export async function deleteTwitterRegistry(
  twitterHandle: string,
  verifiedPubkey: PublicKey,
): Promise<TransactionInstruction[]> {
  const hashedTwitterHandle = getHashedNameSync(twitterHandle);
  const twitterHandleRegistryKey = getNameAccountKeySync(
    hashedTwitterHandle,
    undefined,
    TWITTER_ROOT_PARENT_REGISTRY_KEY,
  );

  const hashedVerifiedPubkey = getHashedNameSync(verifiedPubkey.toString());
  const reverseRegistryKey = getNameAccountKeySync(
    hashedVerifiedPubkey,
    TWITTER_VERIFICATION_AUTHORITY,
    TWITTER_ROOT_PARENT_REGISTRY_KEY,
  );

  const instructions = [
    // Delete the user facing registry
    deleteInstruction(
      NAME_PROGRAM_ID,
      twitterHandleRegistryKey,
      verifiedPubkey,
      verifiedPubkey,
    ),
    // Delete the reverse registry
    deleteInstruction(
      NAME_PROGRAM_ID,
      reverseRegistryKey,
      verifiedPubkey,
      verifiedPubkey,
    ),
  ];

  return instructions;
}
