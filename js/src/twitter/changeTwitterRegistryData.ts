import { Buffer } from "buffer";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import {
  NAME_PROGRAM_ID,
  TWITTER_ROOT_PARENT_REGISTRY_KEY,
} from "../constants";
import { updateInstruction } from "../instructions/updateInstruction";
import { getHashedNameSync } from "../utils/getHashedNameSync";
import { getNameAccountKeySync } from "../utils/getNameAccountKeySync";
import { Numberu32 } from "../int";

/**
 * Builds an instruction that overwrites bytes in a verified Twitter registry.
 *
 * The verified public key must sign the resulting instruction.
 *
 * @param twitterHandle Verified Twitter handle whose registry is updated.
 * @param verifiedPubkey Signer that owns the verified registry.
 * @param offset Byte offset at which to write the data.
 * @param input_data Bytes to write into the registry data.
 * @returns The instruction that updates the registry data.
 *
 * @example
 * ```ts
 * const instructions = await changeTwitterRegistryData("bonfida", owner, 0, Buffer.from("data"));
 * ```
 */
export async function changeTwitterRegistryData(
  twitterHandle: string,
  verifiedPubkey: PublicKey,
  offset: number, // The offset at which to write the input data into the NameRegistryData
  input_data: Buffer,
): Promise<TransactionInstruction[]> {
  const hashedTwitterHandle = getHashedNameSync(twitterHandle);
  const twitterHandleRegistryKey = getNameAccountKeySync(
    hashedTwitterHandle,
    undefined,
    TWITTER_ROOT_PARENT_REGISTRY_KEY,
  );

  const instructions = [
    updateInstruction(
      NAME_PROGRAM_ID,
      twitterHandleRegistryKey,
      new Numberu32(offset),
      input_data,
      verifiedPubkey,
    ),
  ];

  return instructions;
}
