import { PublicKey } from "@solana/web3.js";

import { Record } from "../types/record";
import { _buildValidateSolanaSignatureInstruction } from "./recordValidation";

/**
 * Writes or refreshes the staleness verifier metadata for a .sns V2 record.
 *
 * @param domain The full domain name including TLD (e.g. `"mydomain.sns"`)
 * @param record The record type to validate
 * @param owner The owner of the domain
 * @param payer The fee payer of the transaction
 * @param verifier The verifier to store for staleness checks
 * @returns A transaction instruction that sets the staleness verifier
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
