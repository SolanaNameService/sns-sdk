import {
  deleteRecord as deleteSnsRecord,
  SNS_RECORDS_ID,
} from "@bonfida/sns-records";
import { PublicKey } from "@solana/web3.js";

import { NAME_PROGRAM_ID } from "../constants";
import { InvalidParentError } from "../error";
import { Record, RecordVersion } from "../types/record";
import { getSnsDomainKeySync } from "../utils/getSnsDomainKeySync";
import { _parseSnsDomain } from "../utils/parseSnsDomain";

/**
 * Builds an instruction to delete a record for a `.sns` domain or subdomain.
 *
 * @param domain Full `.sns` domain or subdomain name
 * @param record Record type
 * @param owner Current owner of the domain
 * @param payer Fee payer for the instruction
 * @returns Transaction instruction.
 *
 * @example
 * ```ts
 * const instruction = deleteRecord("example.sns", Record.Url, owner, payer);
 * ```
 */
export const deleteRecord = (
  domain: string,
  record: Record,
  owner: PublicKey,
  payer: PublicKey,
) => {
  const trimmedDomain = _parseSnsDomain(domain);
  let { pubkey, parent, isSub } = getSnsDomainKeySync(
    `${record}.${trimmedDomain}`,
    RecordVersion.V2,
  );

  if (isSub) {
    parent = getSnsDomainKeySync(trimmedDomain).pubkey;
  }

  if (!parent) {
    throw new InvalidParentError("Parent could not be found");
  }

  const ix = deleteSnsRecord(
    payer,
    parent,
    owner,
    pubkey,
    NAME_PROGRAM_ID,
    SNS_RECORDS_ID,
  );
  return ix;
};
