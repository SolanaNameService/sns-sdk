import { PublicKey } from "@solana/web3.js";
import { CENTRAL_STATE_SNS_RECORDS } from "@bonfida/sns-records";
import { Record } from "../types/record";
import { getDomainKeySync } from "../utils/getDomainKeySync";
import { getHashedNameSync } from "../utils/getHashedNameSync";
import { getNameAccountKeySync } from "../utils/getNameAccountKeySync";

/**
 * Derives the V2 record account key.
 *
 * Most consumers should use the high-level record APIs (`getRecord`,
 * `createRecord`, `updateRecord`, etc.). This helper is exposed for callers
 * that need deterministic account derivation.
 * @param domain Full `.sns` or `.sol` domain name
 * @param record Record type
 * @returns Record account public key.
 */
export const getRecordV2Key = (domain: string, record: Record): PublicKey => {
  const { pubkey } = getDomainKeySync(domain);
  const hashed = getHashedNameSync(`\x02`.concat(record as string));
  return getNameAccountKeySync(hashed, CENTRAL_STATE_SNS_RECORDS, pubkey);
};
