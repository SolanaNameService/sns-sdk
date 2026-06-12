import { deleteRecord, SNS_RECORDS_ID } from "@bonfida/sns-records";
import { PublicKey } from "@solana/web3.js";

import { NAME_PROGRAM_ID } from "../constants";
import { InvalidParentError } from "../error";
import { Record, RecordVersion } from "../types/record";
import { getDomainKeySync } from "../utils/getDomainKeySync";
import { parseSupportedTld, SNS_TLD } from "../utils/tld";

/**
 * This function deletes a record v2 and returns the rent to the fee payer
 * @param domain The full domain name including TLD (e.g. `domain.sns`)
 * @param record  The record type enum
 * @param owner The owner of the record to delete
 * @param payer The fee payer of the transaction
 * @returns The delete transaction instruction
 */
export const deleteRecordV2 = (
  domain: string,
  record: Record,
  owner: PublicKey,
  payer: PublicKey,
) => {
  // Only allows .sns domains
  parseSupportedTld(domain, [SNS_TLD]);
  let { pubkey, parent, isSub } = getDomainKeySync(
    `${record}.${domain}`,
    RecordVersion.V2,
  );

  if (isSub) {
    parent = getDomainKeySync(domain).pubkey;
  }

  if (!parent) {
    throw new InvalidParentError("Parent could not be found");
  }

  const ix = deleteRecord(
    payer,
    parent,
    owner,
    pubkey,
    NAME_PROGRAM_ID,
    SNS_RECORDS_ID,
  );
  return ix;
};
