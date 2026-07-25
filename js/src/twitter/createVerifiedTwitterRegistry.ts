import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  NAME_PROGRAM_ID,
  TWITTER_VERIFICATION_AUTHORITY,
  TWITTER_ROOT_PARENT_REGISTRY_KEY,
} from "../constants";
import { createInstruction } from "../instructions/createInstruction";
import { NameRegistryState } from "../state";
import { getHashedNameSync } from "../utils/getHashedNameSync";
import { getNameAccountKeySync } from "../utils/getNameAccountKeySync";
import { Numberu32, Numberu64 } from "../int";

import { createReverseTwitterRegistry } from "./createReverseTwitterRegistry";

/**
 * Builds instructions to create a verified Twitter handle registry and its reverse registry.
 *
 * The authority, payer, and verified public key must sign the resulting instructions.
 *
 * @param connection Solana RPC connection used to calculate rent-exemption costs.
 * @param twitterHandle Twitter handle to verify and register.
 * @param verifiedPubkey Public key associated with the verified handle.
 * @param space Number of bytes available in the user-facing registry.
 * @param payerKey Signer that funds both registry accounts.
 * @returns Instructions that create the handle and reverse registries.
 *
 * @example
 * ```ts
 * const instructions = await createVerifiedTwitterRegistry(connection, "bonfida", owner, 128, payer);
 * ```
 */
export async function createVerifiedTwitterRegistry(
  connection: Connection,
  twitterHandle: string,
  verifiedPubkey: PublicKey,
  space: number, // The space that the user will have to write data into the verified registry
  payerKey: PublicKey,
): Promise<TransactionInstruction[]> {
  // Create user facing registry
  const hashedTwitterHandle = getHashedNameSync(twitterHandle);
  const twitterHandleRegistryKey = getNameAccountKeySync(
    hashedTwitterHandle,
    undefined,
    TWITTER_ROOT_PARENT_REGISTRY_KEY,
  );

  const lamports = await connection.getMinimumBalanceForRentExemption(
    space + NameRegistryState.HEADER_LEN,
  );

  let instructions = [
    createInstruction(
      NAME_PROGRAM_ID,
      SystemProgram.programId,
      twitterHandleRegistryKey,
      verifiedPubkey,
      payerKey,
      hashedTwitterHandle,
      new Numberu64(lamports),
      new Numberu32(space),
      undefined,
      TWITTER_ROOT_PARENT_REGISTRY_KEY,
      TWITTER_VERIFICATION_AUTHORITY, // Twitter authority acts as owner of the parent for all user-facing registries
    ),
  ];

  instructions = instructions.concat(
    await createReverseTwitterRegistry(
      connection,
      twitterHandle,
      twitterHandleRegistryKey,
      verifiedPubkey,
      payerKey,
    ),
  );

  return instructions;
}
