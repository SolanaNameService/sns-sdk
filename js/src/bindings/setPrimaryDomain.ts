import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { SetPrimaryInstruction } from "../instructions/setPrimaryInstruction";
import { PrimaryDomain, NAME_OFFERS_ID } from "../primary-domain";
import { NameRegistryState } from "../state";
import { SNS_ROOT_DOMAIN_ACCOUNT } from "../constants";

/**
 * This function can be used to set a primary domain
 * @param nameAccount The name account being set as primary
 * @param owner The owner of the name account
 * @param programId The name offer program ID
 * @returns
 */
export const setPrimaryDomain = async (
  connection: Connection,
  nameAccount: PublicKey,
  owner: PublicKey,
) => {
  let parent: PublicKey | undefined = undefined;
  const { registry } = await NameRegistryState.retrieve(
    connection,
    nameAccount,
  );
  if (!registry.parentName.equals(SNS_ROOT_DOMAIN_ACCOUNT)) {
    parent = registry.parentName;
  }

  const [primaryKey] = await PrimaryDomain.getKey(NAME_OFFERS_ID, owner);
  const ix = new SetPrimaryInstruction().getInstruction(
    NAME_OFFERS_ID,
    nameAccount,
    primaryKey,
    owner,
    SystemProgram.programId,
    parent,
  );
  return ix;
};
