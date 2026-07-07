import { Record, RecordVersion } from "../types/record";
import { getDomainKeySync } from "../utils/getDomainKeySync";

/**
 * Derives the legacy V1 record account key.
 *
 * This is kept for legacy resolution paths such as SOL record fallback in
 * `resolve`. New record reads/writes should use the high-level record APIs.
 * @param domain Full `.sns` or `.sol` domain name
 * @param record Record type
 * @returns Record account public key.
 */
export const getRecordV1Key = (domain: string, record: Record) => {
  const { pubkey } = getDomainKeySync(record + "." + domain, RecordVersion.V1);
  return pubkey;
};
