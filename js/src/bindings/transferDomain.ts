import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";

import { NAME_PROGRAM_ID, SNS_ROOT_DOMAIN_ACCOUNT } from "../constants";
import { InvalidDomainError } from "../error";
import { transferInstruction } from "../instructions/transferInstruction";
import { NameRegistryState } from "../state";
import { getHashedNameSync } from "../utils/getHashedNameSync";
import { getNameAccountKeySync } from "../utils/getNameAccountKeySync";
import { parseSupportedTld, SNS_TLD } from "../utils/tld";

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
  // Only allows .sns domains
  const [trimmedDomain] = parseSupportedTld(domain, [SNS_TLD]);

  // Basic validation
  if (
    trimmedDomain.includes(".") ||
    trimmedDomain.trim().toLowerCase() !== trimmedDomain
  ) {
    throw new InvalidDomainError("The domain name is malformed");
  }

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
