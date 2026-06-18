import { Instruction } from "@solana/kit";

import {
  RecordVerificationParams,
  _buildValidateSolanaSignatureInstruction,
} from "./recordValidation";

/**
 * Validates the Right of Association of a .sns record using the expected
 * Solana verifier.
 *
 * @param params - An object containing the following properties:
 *   - `domain`: The full .sns domain under which the record resides.
 *   - `record`: An enumeration representing the record type.
 *   - `owner`: The address of the domain's owner.
 *   - `payer`: The address funding the validation process.
 *   - `verifier`: The expected RoA verifier that signs the validation.
 * @returns A promise that resolves to the Solana signature validation instruction.
 */
export const validateRecordRoa = async (
  params: RecordVerificationParams
): Promise<Instruction> =>
  _buildValidateSolanaSignatureInstruction({ ...params, staleness: false });
