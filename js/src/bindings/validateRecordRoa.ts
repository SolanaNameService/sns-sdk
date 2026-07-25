import { PublicKey } from "@solana/web3.js";

import { Record } from "../types/record";
import { _buildValidateSolanaSignatureInstruction } from "./recordValidation";

/**
 * Builds an instruction to validate a record's Right of Association with a Solana verifier.
 *
 * @param domain Full `.sns` domain or subdomain name
 * @param record Record type
 * @param owner Current owner of the domain
 * @param payer Fee payer for the instruction
 * @param verifier Verifier account used by the record validation instruction
 * @returns Transaction instruction.
 *
 * @example
 * ```ts
 * const instruction = validateRecordRoa("example.sns", Record.Url, owner, payer, verifier);
 * ```
 */
export const validateRecordRoa = (
  domain: string,
  record: Record,
  owner: PublicKey,
  payer: PublicKey,
  verifier: PublicKey,
) =>
  _buildValidateSolanaSignatureInstruction({
    staleness: false,
    domain,
    record,
    owner,
    payer,
    verifier,
  });
