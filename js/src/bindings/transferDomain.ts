import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";

import { NAME_PROGRAM_ID, SNS_ROOT_DOMAIN_ACCOUNT } from "../constants";
import { transferInstruction } from "../instructions/transferInstruction";
import { NameRegistryState } from "../state";
import { getHashedNameSync } from "../utils/getHashedNameSync";
import { getNameAccountKeySync } from "../utils/getNameAccountKeySync";
import { _parseSnsTopLevelDomain } from "../utils/parseSnsDomain";

/**
 * Change the owner of a given name account.
 *
 * @param connection The solana connection object to the RPC node
 * @param domain The domain to transfer, must include the TLD suffix (e.g. `mydomain.sns`).
 * @param newOwner The new owner to be set
 * @returns
 */
export async function transferDomain(
  connection: Connection,
  domain: string,
  newOwner: PublicKey,
): Promise<TransactionInstruction> {
  const trimmedDomain = _parseSnsTopLevelDomain(domain);

  const hashed_name = getHashedNameSync(trimmedDomain);
  const nameAccountKey = getNameAccountKeySync(
    hashed_name,
    undefined,
    SNS_ROOT_DOMAIN_ACCOUNT,
  );
  const currentNameOwner = (
    await NameRegistryState.retrieve(connection, nameAccountKey)
  ).registry.owner;

  return transferInstruction(
    NAME_PROGRAM_ID,
    nameAccountKey,
    newOwner,
    currentNameOwner,
  );
}
