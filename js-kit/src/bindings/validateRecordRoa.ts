import { Instruction } from "@solana/kit";

import {
  RecordVerificationParams,
  _buildValidateSolanaSignatureInstruction,
} from "./recordValidation";

/**
 * Builds an instruction to validate a V2 record's Right of Association with a Solana verifier.
 *
 * @param params Record validation parameters
 * @param params.domain Full `.sns` domain or subdomain name
 * @param params.record Record type
 * @param params.owner Current owner of the domain
 * @param params.payer Fee payer for the instruction
 * @param params.verifier Verifier account used by the record validation instruction
 * @returns Transaction instruction.
 */
export const validateRecordRoa = async (
  params: RecordVerificationParams
): Promise<Instruction> =>
  _buildValidateSolanaSignatureInstruction({ ...params, staleness: false });
