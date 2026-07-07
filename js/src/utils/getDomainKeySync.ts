import { PublicKey } from "@solana/web3.js";
import { SNS_ROOT_DOMAIN_ACCOUNT } from "../constants";
import { Buffer } from "buffer";
import { CENTRAL_STATE_SNS_RECORDS } from "@bonfida/sns-records";
import { RecordVersion } from "../types/record";
import { InvalidInputError } from "../error";
import { SOL_TLD, parseSupportedTld } from "./tld";

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
 * Key derivation handler for `.sns` domains.
 *
 * Expects the input domain name to already have its TLD trimmed.
 */
const getSnsDomainKeySync = (domain: string, record?: RecordVersion) => {
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

/**
 * Key derivation handler for `.sol` domains.
 *
 * Expects the input domain name to already have its TLD trimmed.
 *
 * @throws {Error} Always - `.sol`-specific key derivation is not yet implemented.
 */
const getSolDomainKeySync = (
  _domain: string,
  _record?: RecordVersion,
): ReturnType<typeof getSnsDomainKeySync> => {
  throw new Error("getSolDomainKeySync is not yet implemented");
};

void getSolDomainKeySync;

/**
 * Computes the public key of a domain or subdomain.
 *
 * A TLD suffix is required - the domain must end with `.sns` or `.sol`
 * (e.g. `mydomain.sns`, `sub.parent.sns`, `alice.sol`). Bare names without a recognised
 * suffix will throw {@link UnsupportedTldError}.
 *
 * Both `.sns` and `.sol` currently route to the SNS derivation logic, preserving
 * existing on-chain key derivation. `.sol`-specific derivation is reserved for a
 * future release.
 *
 * @param domain Full `.sns` or `.sol` domain name
 * @param record Optional record version for record account derivation
 * @returns Domain account public key, hash, parent information, and subdomain flags.
 * @throws {UnsupportedTldError} When the domain is missing a supported TLD suffix
 */
export const getDomainKeySync = (domain: string, record?: RecordVersion) => {
  const [trimmedDomain, tld] = parseSupportedTld(domain);

  if (tld === SOL_TLD) {
    // Both .sns and .sol currently use SNS derivation for compatibility.
    // Switch this branch to getSolDomainKeySync once implemented.
    return getSnsDomainKeySync(trimmedDomain, record);
  }

  return getSnsDomainKeySync(trimmedDomain, record);
};
