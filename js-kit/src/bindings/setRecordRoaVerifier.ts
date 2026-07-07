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
 * Builds an instruction to store the expected Right of Association verifier for a V2 record.
 *
 * @param params V2 record validation parameters
 * @param params.domain Full `.sns` domain or subdomain name
 * @param params.record V2 record type
 * @param params.owner Current owner of the domain
 * @param params.payer Fee payer for the instruction
 * @param params.verifier Verifier account used by the record validation instruction
 * @returns Transaction instruction.
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
