import { Address, Instruction } from "@solana/kit";

import {
  CENTRAL_STATE_DOMAIN_RECORDS,
  NAME_PROGRAM_ADDRESS,
  RECORDS_PROGRAM_ADDRESS,
  SYSTEM_PROGRAM_ADDRESS,
} from "../constants/addresses";
import { ValidateEthereumSignatureInstruction } from "../instructions/validateEthereumSignatureInstruction";
import { Record } from "../types/record";
import { Validation } from "../types/validation";
import { _parseSnsDomain } from "../utils/parseSnsDomain";
import { _getRecordAndParentAddress } from "./recordValidation";

interface ValidateRecordRoaEthereumParams {
  domain: string;
  record: Record;
  owner: Address;
  payer: Address;
  signature: Uint8Array;
  expectedPubkey: Uint8Array;
}

/**
 * Builds an instruction to validate a V2 record's Right of Association with an Ethereum signature.
 *
 * @param params Record validation parameters
 * @param params.domain Full `.sns` domain or subdomain name
 * @param params.record Record type
 * @param params.owner Current owner of the domain
 * @param params.payer Fee payer for the instruction
 * @param params.signature Ethereum signature used for validation
 * @param params.expectedPubkey Expected Ethereum public key for validation
 * @returns Transaction instruction.
 */
export const validateRecordRoaEthereum = async ({
  domain,
  record,
  owner,
  payer,
  signature,
  expectedPubkey,
}: ValidateRecordRoaEthereumParams): Promise<Instruction> => {
  const trimmedDomain = _parseSnsDomain(domain);

  const { domainAddress, parentAddress } = await _getRecordAndParentAddress({
    domain: trimmedDomain,
    record,
  });

  return new ValidateEthereumSignatureInstruction({
    validation: Validation.Ethereum,
    signature,
    expectedPubkey,
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
