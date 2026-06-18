import { Instruction } from "@solana/kit";

import {
  RecordVerificationParams,
  _buildValidateSolanaSignatureInstruction,
} from "./recordValidation";

/**
 * Writes or refreshes the staleness verifier metadata for a .sns record.
 *
 * Runtime staleness is still verified client-side/read-time by comparing this
 * stored verifier metadata against the current domain owner.
 *
 * @param params - An object containing the following properties:
 *   - `domain`: The full .sns domain under which the record resides.
 *   - `record`: An enumeration representing the record type.
 *   - `owner`: The address of the domain's owner.
 *   - `payer`: The address funding the operation.
 *   - `verifier`: The verifier to store for staleness checks.
 * @returns A promise that resolves to the Solana signature validation instruction.
 */
export const setRecordStalenessVerifier = async (
  params: RecordVerificationParams
): Promise<Instruction> =>
  _buildValidateSolanaSignatureInstruction({ ...params, staleness: true });
