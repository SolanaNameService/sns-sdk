import { allocateAndPostRecord, SNS_RECORDS_ID } from "@bonfida/sns-records";
import { PublicKey } from "@solana/web3.js";

import { NAME_PROGRAM_ID } from "../constants";
import { InvalidParentError } from "../error";
import { serializeRecordV2Content } from "../record_v2/serializeRecordV2Content";
import { Record, RecordVersion } from "../types/record";
import { getDomainKeySync } from "../utils/getDomainKeySync";
import { parseSupportedTld, SNS_TLD } from "../utils/tld";

/**
 * This function can be used be create a record V2, it handles the serialization of the record data following SNS-IP 1 guidelines
 * @param domain The full domain name including TLD (e.g. `domain.sns`)
 * @param record The record enum object
 * @param recordV2 The `RecordV2` object that will be serialized into the record via the update instruction
 * @param owner The owner of the domain
 * @param payer The fee payer of the transaction
 * @returns
 */
export const createRecordV2Instruction = (
  domain: string,
  record: Record,
  content: string,
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

  const ix = allocateAndPostRecord(
    payer,
    pubkey,
    parent,
    owner,
    NAME_PROGRAM_ID,
    `\x02`.concat(record as string),
    serializeRecordV2Content(content, record),
    SNS_RECORDS_ID,
  );
  return ix;
};
