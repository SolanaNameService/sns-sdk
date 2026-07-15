import { CENTRAL_STATE_SNS_RECORDS } from "@bonfida/sns-records";
import { PublicKey } from "@solana/web3.js";

import { Record } from "../types/record";
import { getSnsDomainKeySync } from "../utils/getSnsDomainKeySync";
import { getHashedNameSync } from "../utils/getHashedNameSync";
import { getNameAccountKeySync } from "../utils/getNameAccountKeySync";

/**
 * Derives the V2 record account key.
 *
 * Most consumers should use the high-level record APIs (`getRecord`,
 * `createRecord`, `updateRecord`, etc.). This helper is exposed for callers
 * that need deterministic account derivation.
 *
 * The caller must trim the TLD suffix before calling this function. For
 * example, pass `"example"` instead of `"example.sns"`.
 *
 * @param domain Domain name with its TLD suffix trimmed
 * @param record Record type
 * @returns Record account public key
 */
export const getRecordV2Key = (domain: string, record: Record): PublicKey => {
  const { pubkey } = getSnsDomainKeySync(domain);
  const hashed = getHashedNameSync(`\x02`.concat(record as string));

  return getNameAccountKeySync(hashed, CENTRAL_STATE_SNS_RECORDS, pubkey);
};
