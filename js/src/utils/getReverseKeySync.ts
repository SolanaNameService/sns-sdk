import { REVERSE_LOOKUP_CLASS } from "../constants";

import { getHashedNameSync } from "./getHashedNameSync";
import { getNameAccountKeySync } from "./getNameAccountKeySync";
import { getDomainKeySync } from "./getDomainKeySync";

/**
 * Derives the reverse lookup account for a domain name.
 *
 * @param domain Full `.sns` or `.sol` domain name
 * @param isSub Whether the domain is a subdomain
 * @returns Reverse lookup account public key.
 */
export const getReverseKeySync = (domain: string, isSub?: boolean) => {
  const { pubkey, parent } = getDomainKeySync(domain);
  const hashedReverseLookup = getHashedNameSync(pubkey.toBase58());
  const reverseLookupAccount = getNameAccountKeySync(
    hashedReverseLookup,
    REVERSE_LOOKUP_CLASS,
    isSub ? parent : undefined,
  );
  return reverseLookupAccount;
};
