import { PublicKey } from "@solana/web3.js";

import { Record } from "../types/record";
import { _buildValidateSolanaSignatureInstruction } from "./recordValidation";

/**
 * Validates the Right of Association of a .sns V2 record using a Solana verifier.
 *
 * @param domain The full domain name including TLD (e.g. `"mydomain.sns"`)
 * @param record The record type to validate
 * @param owner The owner of the domain
 * @param payer The fee payer of the transaction
 * @param verifier The expected RoA verifier that signs the validation
 * @returns A transaction instruction that validates the record RoA
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
