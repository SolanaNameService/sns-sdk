import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { deleteInstruction } from "../instructions/deleteInstruction";
import { NameRegistryState } from "../state";
import { NAME_PROGRAM_ID } from "../constants";
import { getHashedNameSync } from "../utils/getHashedNameSync";
import { getNameAccountKeySync } from "../utils/getNameAccountKeySync";

/**
 * Builds an instruction to delete a name account and transfer reclaimed rent.
 *
 * @param connection Solana RPC connection
 * @param name Name of the name account
 * @param refundTargetKey Refund destination address
 * @param nameClass Optional class of the name account
 * @param nameParent Optional parent name account
 * @returns Transaction instruction.
 */
export async function deleteNameRegistry(
  connection: Connection,
  name: string,
  refundTargetKey: PublicKey,
  nameClass?: PublicKey,
  nameParent?: PublicKey,
): Promise<TransactionInstruction> {
  const hashed_name = getHashedNameSync(name);
  const nameAccountKey = getNameAccountKeySync(
    hashed_name,
    nameClass,
    nameParent,
  );

  let nameOwner: PublicKey;
  if (nameClass) {
    nameOwner = nameClass;
  } else {
    nameOwner = (await NameRegistryState.retrieve(connection, nameAccountKey))
      .registry.owner;
  }

  const changeAuthoritiesInstr = deleteInstruction(
    NAME_PROGRAM_ID,
    nameAccountKey,
    refundTargetKey,
    nameOwner,
  );

  return changeAuthoritiesInstr;
}
