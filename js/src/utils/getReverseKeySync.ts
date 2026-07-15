import { REVERSE_LOOKUP_CLASS } from "../constants";

import { getHashedNameSync } from "./getHashedNameSync";
import { getNameAccountKeySync } from "./getNameAccountKeySync";
import { getSnsDomainKeySync } from "./getSnsDomainKeySync";

/**
 * Derives the reverse lookup account for a domain name.
 *
 * The caller must trim the TLD suffix before calling this function.
 *
 * @param domain Domain name with its TLD suffix trimmed
 * @param isSub Set to true when deriving a subdomain reverse account
 * @returns Reverse lookup account public key.
 */
export const getReverseKeySync = (domain: string, isSub?: boolean) => {
  const { pubkey, parent } = getSnsDomainKeySync(domain);
  const hashedReverseLookup = getHashedNameSync(pubkey.toBase58());
  const reverseLookupAccount = getNameAccountKeySync(
    hashedReverseLookup,
    REVERSE_LOOKUP_CLASS,
    isSub ? parent : undefined,
  );
  return reverseLookupAccount;
};
