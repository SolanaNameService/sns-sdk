import { PublicKey, SystemProgram } from "@solana/web3.js";

import {
  NAME_PROGRAM_ID,
  REGISTER_PROGRAM_ID,
  REVERSE_LOOKUP_CLASS,
} from "../constants";
import { BurnInstruction } from "../instructions/burnInstruction";
import { getDomainKeySync } from "../utils/getDomainKeySync";
import { getReverseKeySync } from "../utils/getReverseKeySync";
import { _parseSnsTopLevelDomain } from "../utils/parseSnsDomain";

/**
 * Builds an instruction to burn a top-level `.sns` domain and its reverse lookup account.
 *
 * @param domain Full `.sns` domain name
 * @param owner Current owner of the domain
 * @param target Account that receives reclaimed lamports
 * @returns Transaction instruction.
 */
export const burnDomain = (
  domain: string,
  owner: PublicKey,
  target: PublicKey,
) => {
  _parseSnsTopLevelDomain(domain);

  const { pubkey } = getDomainKeySync(domain);
  const [state] = PublicKey.findProgramAddressSync(
    [pubkey.toBuffer()],
    REGISTER_PROGRAM_ID,
  );
  const [resellingState] = PublicKey.findProgramAddressSync(
    [pubkey.toBuffer(), Uint8Array.from([1, 1])],
    REGISTER_PROGRAM_ID,
  );

  const ix = new BurnInstruction().getInstruction(
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
