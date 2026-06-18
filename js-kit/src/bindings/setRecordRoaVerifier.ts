import { Instruction } from "@solana/kit";

import {
  CENTRAL_STATE_DOMAIN_RECORDS,
  NAME_PROGRAM_ADDRESS,
  RECORDS_PROGRAM_ADDRESS,
  SYSTEM_PROGRAM_ADDRESS,
} from "../constants/addresses";
import { SetRecordRoaVerifierInstruction } from "../instructions/setRecordRoaVerifierInstruction";
import { _parseSnsDomain } from "../utils/parseSnsDomain";
import {
  RecordVerificationParams,
  _getRecordAndParentAddress,
} from "./recordValidation";

/**
 * Stores the expected Right of Association verifier for a .sns record.
 *
 * @param params - An object containing the following properties:
 *   - `domain`: The full .sns domain under which the record resides.
 *   - `record`: An enumeration representing the record type.
 *   - `owner`: The address of the domain's owner.
 *   - `payer`: The address funding the operation.
 *   - `verifier`: The expected RoA verifier to store in the record.
 * @returns A promise that resolves to the set record RoA verifier instruction.
 */
export const setRecordRoaVerifier = async ({
  domain,
  record,
  owner,
  payer,
  verifier,
}: RecordVerificationParams): Promise<Instruction> => {
  _parseSnsDomain(domain);

  const { domainAddress, parentAddress } = await _getRecordAndParentAddress({
    domain,
    record,
  });

  return new SetRecordRoaVerifierInstruction({
    verifier,
  }).getInstruction(
    RECORDS_PROGRAM_ADDRESS,
    SYSTEM_PROGRAM_ADDRESS,
    NAME_PROGRAM_ADDRESS,
    payer,
    domainAddress,
    parentAddress,
    owner,
    CENTRAL_STATE_DOMAIN_RECORDS
  );
};
