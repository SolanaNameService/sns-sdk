import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";

import { NAME_PROGRAM_ID } from "../constants";
import { createInstruction } from "../instructions/createInstruction";
import { Numberu32, Numberu64 } from "../int";
import { NameRegistryState } from "../state";
import { getHashedNameSync } from "../utils/getHashedNameSync";
import { getNameAccountKeySync } from "../utils/getNameAccountKeySync";

/**
 * Builds an instruction to create a name account with the given rent budget, space, owner, and class.
 *
 * @param connection Solana RPC connection
 * @param name Name of the new account
 * @param space Space in bytes allocated to the account
 * @param payerKey Account paying for allocation
 * @param nameOwner Owner of the new name account
 * @param lamports Lamports to fund the account. Defaults to the rent-exempt minimum
 * @param nameClass Optional class of the new name account
 * @param parentName Optional parent name account. Its owner must sign when provided
 * @returns Transaction instruction.
 *
 * @example
 * ```ts
 * const instruction = await createNameRegistry(connection, "example", 1000, payer, owner);
 * ```
 */
export async function createNameRegistry(
  connection: Connection,
  name: string,
  space: number,
  payerKey: PublicKey,
  nameOwner: PublicKey,
  lamports?: number,
  nameClass?: PublicKey,
  parentName?: PublicKey,
): Promise<TransactionInstruction> {
  const hashed_name = getHashedNameSync(name);
  const nameAccountKey = getNameAccountKeySync(
    hashed_name,
    nameClass,
    parentName,
  );

  const balance = lamports
    ? lamports
    : await connection.getMinimumBalanceForRentExemption(space);

  let nameParentOwner: PublicKey | undefined;
  if (parentName) {
    const { registry: parentAccount } = await NameRegistryState.retrieve(
      connection,
      parentName,
    );
    nameParentOwner = parentAccount.owner;
  }

  const createNameInstr = createInstruction(
    NAME_PROGRAM_ID,
    SystemProgram.programId,
    nameAccountKey,
    nameOwner,
    payerKey,
    hashed_name,
    new Numberu64(balance),
    new Numberu32(space),
    nameClass,
    parentName,
    nameParentOwner,
  );

  return createNameInstr;
}
