import { editRecord, SNS_RECORDS_ID } from "@bonfida/sns-records";
import { PublicKey } from "@solana/web3.js";

import { NAME_PROGRAM_ID } from "../constants";
import { InvalidParentError } from "../error";
import { serializeRecordContent } from "../record/serializeRecordContent";
import { Record, RecordVersion } from "../types/record";
import { getDomainKeySync } from "../utils/getDomainKeySync";
import { _parseSnsDomain } from "../utils/parseSnsDomain";

/**
 * Updates a record account and serializes its content according to SNS-IP 1.
 *
 * @param domain The full domain name including TLD (e.g. `mydomain.sns`)
 * @param record The record type enum
 * @param content The record content to serialize and store
 * @param owner The owner of the record/domain
 * @param payer The fee payer of the transaction
 * @returns The update record transaction instruction
 */
export const updateRecord = (
  domain: string,
  record: Record,
  content: string,
  owner: PublicKey,
  payer: PublicKey,
) => {
  _parseSnsDomain(domain);

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

  const ix = editRecord(
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
