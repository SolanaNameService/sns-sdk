import { PublicKey } from "@solana/web3.js";

import { Record } from "../types/record";
import { _buildValidateSolanaSignatureInstruction } from "./recordValidation";

/**
 * Builds an instruction to write or refresh staleness verifier metadata.
 *
 * @param domain Full `.sns` domain or subdomain name
 * @param record Record type
 * @param owner Current owner of the domain
 * @param payer Fee payer for the instruction
 * @param verifier Verifier account used by the record validation instruction
 * @returns Transaction instruction.
 */
export const setRecordStalenessVerifier = (
  domain: string,
  record: Record,
  owner: PublicKey,
  payer: PublicKey,
  verifier: PublicKey,
) =>
  _buildValidateSolanaSignatureInstruction({
    staleness: true,
    domain,
    record,
    owner,
    payer,
    verifier,
  });
