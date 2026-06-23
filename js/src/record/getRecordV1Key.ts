import { Record, RecordVersion } from "../types/record";
import { getDomainKeySync } from "../utils/getDomainKeySync";

/**
 * Derives the legacy V1 record account key.
 *
 * This is kept for legacy resolution paths such as SOL record fallback in
 * `resolve`. New record reads/writes should use the high-level record APIs.
 * @param domain The full domain name including TLD (e.g. `mydomain.sns`, `sub.parent.sns`)
 * @param record The record to derive the key for
 * @returns Public key of the record
 */
export const getRecordV1Key = (domain: string, record: Record) => {
  const { pubkey } = getDomainKeySync(record + "." + domain, RecordVersion.V1);
  return pubkey;
};
