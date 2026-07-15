import { allocateAndPostRecord, SNS_RECORDS_ID } from "@bonfida/sns-records";
import { PublicKey } from "@solana/web3.js";

import { NAME_PROGRAM_ID } from "../constants";
import { InvalidParentError } from "../error";
import { serializeRecordContent } from "../record/serializeRecordContent";
import { Record, RecordVersion } from "../types/record";
import { getSnsDomainKeySync } from "../utils/getSnsDomainKeySync";
import { _parseSnsDomain } from "../utils/parseSnsDomain";

/**
 * Builds an instruction to create a record for a `.sns` domain or subdomain.
 *
 * @param domain Full `.sns` domain or subdomain name
 * @param record Record type
 * @param content Record content
 * @param owner Current owner of the domain
 * @param payer Fee payer for the instruction
 * @returns Transaction instruction.
 */
export const createRecord = (
  domain: string,
  record: Record,
  content: string,
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

  const ix = allocateAndPostRecord(
    payer,
    pubkey,
    parent,
    owner,
    NAME_PROGRAM_ID,
    `\x02`.concat(record as string),
    serializeRecordContent(content, record),
    SNS_RECORDS_ID,
  );
  return ix;
};
