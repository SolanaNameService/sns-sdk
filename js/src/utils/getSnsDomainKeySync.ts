import { PublicKey } from "@solana/web3.js";
import { SNS_ROOT_DOMAIN_ACCOUNT } from "../constants";
import { Buffer } from "buffer";
import { CENTRAL_STATE_SNS_RECORDS } from "@bonfida/sns-records";
import { RecordVersion } from "../types/record";
import { InvalidInputError } from "../error";

import { getHashedNameSync } from "./getHashedNameSync";
import { getNameAccountKeySync } from "./getNameAccountKeySync";

const _deriveSync = (
  name: string,
  parent: PublicKey = SNS_ROOT_DOMAIN_ACCOUNT,
  classKey?: PublicKey,
) => {
  let hashed = getHashedNameSync(name);
  let pubkey = getNameAccountKeySync(hashed, classKey, parent);
  return { pubkey, hashed };
};

/**
 * Derives an SNS namespace account from a TLD-trimmed domain name.
 *
 * The caller must trim the TLD suffix before calling this function. For
 * example, pass `"example"` instead of `"example.sns"`, and pass
 * `"sub.example"` instead of `"sub.example.sns"`.
 *
 * @param domain Domain name with its TLD suffix trimmed
 * @param record Optional record version when deriving a record account
 * @returns Derived account key, name hash, and parent/subdomain metadata
 * @throws {InvalidInputError} When the trimmed domain has unsupported nesting
 */
export const getSnsDomainKeySync = (domain: string, record?: RecordVersion) => {
  const recordClass =
    record === RecordVersion.V2 ? CENTRAL_STATE_SNS_RECORDS : undefined;
  const splitted = domain.split(".");
  if (splitted.length === 2) {
    const prefix = Buffer.from([record ? record : 0]).toString();
    const sub = prefix.concat(splitted[0]);
    const { pubkey: parentKey } = _deriveSync(splitted[1]);
    const result = _deriveSync(sub, parentKey, recordClass);
    return { ...result, isSub: true, parent: parentKey };
  } else if (splitted.length === 3 && !!record) {
    // Parent key
    const { pubkey: parentKey } = _deriveSync(splitted[2]);
    // Sub domain
    const { pubkey: subKey } = _deriveSync("\0".concat(splitted[1]), parentKey);
    // Sub record
    const recordPrefix = record === RecordVersion.V2 ? `\x02` : `\x01`;
    const result = _deriveSync(
      recordPrefix.concat(splitted[0]),
      subKey,
      recordClass,
    );
    return { ...result, isSub: true, parent: parentKey, isSubRecord: true };
  } else if (splitted.length >= 3) {
    throw new InvalidInputError("The domain is malformed");
  }
  const result = _deriveSync(domain, SNS_ROOT_DOMAIN_ACCOUNT);
  return { ...result, isSub: false, parent: undefined };
};
