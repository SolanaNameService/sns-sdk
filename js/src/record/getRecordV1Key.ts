import { Record, RecordVersion } from "../types/record";
import { getSnsDomainKeySync } from "../utils/getSnsDomainKeySync";

/**
 * Derives the legacy V1 record account key.
 *
 * This is kept for legacy resolution paths such as SOL record fallback in
 * `resolve`. New record reads/writes should use the high-level record APIs.
 * The caller must trim the TLD suffix before calling this function. For
 * example, pass `"example"` instead of `"example.sns"`.
 *
 * @param domain Domain name with its TLD suffix trimmed
 * @param record Record type
 * @returns Record account public key
 */
export const getRecordV1Key = (domain: string, record: Record) => {
  const { pubkey } = getSnsDomainKeySync(
    record + "." + domain,
    RecordVersion.V1,
  );
  return pubkey;
};
