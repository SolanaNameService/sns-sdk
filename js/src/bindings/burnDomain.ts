import { PublicKey, SystemProgram } from "@solana/web3.js";

import {
  NAME_PROGRAM_ID,
  REGISTER_PROGRAM_ID,
  REVERSE_LOOKUP_CLASS,
} from "../constants";
import { burnInstruction } from "../instructions/burnInstruction";
import { getDomainKeySync } from "../utils/getDomainKeySync";
import { getReverseKeySync } from "../utils/getReverseKeySync";
import { parseSupportedTld, SNS_TLD } from "../utils/tld";

/**
 * Builds the instruction to burn (permanently delete) a domain name and its
 * reverse lookup account, returning any lamports to the target account.
 *
 * @param domain The domain to burn, must include the TLD suffix (e.g. `mydomain.sns`).
 * @param owner The current owner of the domain
 * @param target The account that will receive the reclaimed lamports
 * @returns A {@link TransactionInstruction} that burns the domain
 */
export const burnDomain = (
  domain: string,
  owner: PublicKey,
  target: PublicKey,
) => {
  // Only allows .sns domains
  parseSupportedTld(domain, [SNS_TLD]);

  const { pubkey } = getDomainKeySync(domain);
  const [state] = PublicKey.findProgramAddressSync(
    [pubkey.toBuffer()],
    REGISTER_PROGRAM_ID,
  );
  const [resellingState] = PublicKey.findProgramAddressSync(
    [pubkey.toBuffer(), Uint8Array.from([1, 1])],
    REGISTER_PROGRAM_ID,
  );

  const ix = new burnInstruction().getInstruction(
    REGISTER_PROGRAM_ID,
    NAME_PROGRAM_ID,
    SystemProgram.programId,
    pubkey,
    getReverseKeySync(domain),
    resellingState,
    state,
    REVERSE_LOOKUP_CLASS,
    owner,
    target,
  );
  return ix;
};
