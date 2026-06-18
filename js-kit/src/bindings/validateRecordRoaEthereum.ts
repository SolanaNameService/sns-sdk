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
 * Validates the Right of Association of a .sns record using an Ethereum
 * signature.
 *
 * @param params - An object containing the following properties:
 *   - `domain`: The full .sns domain under which the record resides.
 *   - `record`: An enumeration representing the record type.
 *   - `owner`: The address of the domain's owner.
 *   - `payer`: The address funding the validation process.
 *   - `signature`: The Ethereum signature used for validation.
 *   - `expectedPubkey`: The expected Ethereum public key associated with the validation.
 * @returns A promise that resolves to the Ethereum signature validation instruction.
 */
export const validateRecordRoaEthereum = async ({
  domain,
  record,
  owner,
  payer,
  signature,
  expectedPubkey,
}: ValidateRecordRoaEthereumParams): Promise<Instruction> => {
  _parseSnsDomain(domain);

  const { domainAddress, parentAddress } = await _getRecordAndParentAddress({
    domain,
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
