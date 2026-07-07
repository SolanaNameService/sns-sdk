import { PublicKey } from "@solana/web3.js";
import { REVERSE_LOOKUP_CLASS } from "../constants";

import { getHashedNameSync } from "./getHashedNameSync";
import { getNameAccountKeySync } from "./getNameAccountKeySync";

/**
 * Derives the reverse lookup account for a domain account.
 *
 * @param domainKey Domain account public key
 * @param parent Optional parent name account for subdomain reverse lookups
 * @returns Reverse lookup account public key.
 */
export const getReverseKeyFromDomainKey = (
  domainKey: PublicKey,
  parent?: PublicKey,
) => {
  const hashedReverseLookup = getHashedNameSync(domainKey.toBase58());
  const reverseLookupAccount = getNameAccountKeySync(
    hashedReverseLookup,
    REVERSE_LOOKUP_CLASS,
    parent,
  );
  return reverseLookupAccount;
};
