import { Buffer } from "buffer";
import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { updateInstruction } from "../instructions/updateInstruction";
import { NameRegistryState } from "../state";
import { Numberu32 } from "../int";
import { NAME_PROGRAM_ID } from "../constants";
import { getHashedNameSync } from "../utils/getHashedNameSync";
import { getNameAccountKeySync } from "../utils/getNameAccountKeySync";

/**
 * Builds an instruction to overwrite name registry data.
 *
 * @param connection Solana RPC connection
 * @param name Name of the name registry to update
 * @param offset Offset where data should be written
 * @param input_data Data to write
 * @param nameClass Optional class of the name account
 * @param nameParent Optional parent name account
 * @returns Transaction instruction.
 *
 * @example
 * ```ts
 * const instruction = await updateNameRegistry(connection, "example", 0, Buffer.from("data"));
 * ```
 */
export async function updateNameRegistry(
  connection: Connection,
  name: string,
  offset: number,
  input_data: Buffer,
  nameClass?: PublicKey,
  nameParent?: PublicKey,
): Promise<TransactionInstruction> {
  const hashed_name = getHashedNameSync(name);
  const nameAccountKey = getNameAccountKeySync(
    hashed_name,
    nameClass,
    nameParent,
  );

  let signer: PublicKey;
  if (nameClass) {
    signer = nameClass;
  } else {
    signer = (await NameRegistryState.retrieve(connection, nameAccountKey))
      .registry.owner;
  }

  const updateInstr = updateInstruction(
    NAME_PROGRAM_ID,
    nameAccountKey,
    new Numberu32(offset),
    input_data,
    signer,
  );

  return updateInstr;
}
