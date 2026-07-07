import { Instruction } from "@solana/kit";

import {
  RecordVerificationParams,
  _buildValidateSolanaSignatureInstruction,
} from "./recordValidation";

/**
 * Builds an instruction to write or refresh staleness verifier metadata for a V2 record.
 *
 * @param params V2 record validation parameters
 * @param params.domain Full `.sns` domain or subdomain name
 * @param params.record V2 record type
 * @param params.owner Current owner of the domain
 * @param params.payer Fee payer for the instruction
 * @param params.verifier Verifier account used by the record validation instruction
 * @returns Transaction instruction.
 */
export const setRecordStalenessVerifier = async (
  params: RecordVerificationParams
): Promise<Instruction> =>
  _buildValidateSolanaSignatureInstruction({ ...params, staleness: true });
