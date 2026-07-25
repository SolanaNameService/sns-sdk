import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import {
  NAME_PROGRAM_ID,
  TWITTER_VERIFICATION_AUTHORITY,
  TWITTER_ROOT_PARENT_REGISTRY_KEY,
} from "../constants";
import { deleteNameRegistry } from "../bindings/deleteNameRegistry";
import { transferInstruction } from "../instructions/transferInstruction";
import { getHashedNameSync } from "../utils/getHashedNameSync";
import { getNameAccountKeySync } from "../utils/getNameAccountKeySync";
import { createReverseTwitterRegistry } from "./createReverseTwitterRegistry";

/**
 * Builds instructions to transfer a Twitter handle to a new verified public key.
 *
 * The authority, current verified key, and payer must sign the resulting instructions.
 *
 * @param connection Solana RPC connection used to calculate rent-exemption costs.
 * @param twitterHandle Verified Twitter handle to transfer.
 * @param currentVerifiedPubkey Current verified owner and required signer.
 * @param newVerifiedPubkey Public key that will become the verified owner.
 * @param payerKey Signer that funds creation of the new reverse registry.
 * @returns Instructions that transfer the handle and recreate its reverse registry.
 *
 * @example
 * ```ts
 * const instructions = await changeVerifiedPubkey(
 *   connection,
 *   "bonfida",
 *   currentOwner,
 *   newOwner,
 *   payer,
 * );
 * ```
 */
export async function changeVerifiedPubkey(
  connection: Connection,
  twitterHandle: string,
  currentVerifiedPubkey: PublicKey,
  newVerifiedPubkey: PublicKey,
  payerKey: PublicKey,
): Promise<TransactionInstruction[]> {
  const hashedTwitterHandle = getHashedNameSync(twitterHandle);
  const twitterHandleRegistryKey = getNameAccountKeySync(
    hashedTwitterHandle,
    undefined,
    TWITTER_ROOT_PARENT_REGISTRY_KEY,
  );

  // Transfer the user-facing registry ownership
  let instructions = [
    transferInstruction(
      NAME_PROGRAM_ID,
      twitterHandleRegistryKey,
      newVerifiedPubkey,
      currentVerifiedPubkey,
      undefined,
    ),
  ];

  instructions.push(
    await deleteNameRegistry(
      connection,
      currentVerifiedPubkey.toString(),
      payerKey,
      TWITTER_VERIFICATION_AUTHORITY,
      TWITTER_ROOT_PARENT_REGISTRY_KEY,
    ),
  );

  // Create the new reverse registry
  instructions = instructions.concat(
    await createReverseTwitterRegistry(
      connection,
      twitterHandle,
      twitterHandleRegistryKey,
      newVerifiedPubkey,
      payerKey,
    ),
  );

  return instructions;
}
