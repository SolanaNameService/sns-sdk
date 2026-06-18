import { Address, Instruction } from "@solana/kit";

import {
  CENTRAL_STATE_DOMAIN_RECORDS,
  NAME_PROGRAM_ADDRESS,
  RECORDS_PROGRAM_ADDRESS,
  SYSTEM_PROGRAM_ADDRESS,
} from "../constants/addresses";
import { getDomainAddress } from "../domain/getDomainAddress";
import { InvalidParentError } from "../errors";
import { ValidateSolanaSignatureInstruction } from "../instructions/validateSolanaSignatureInstruction";
import { Record, RecordVersion } from "../types/record";
import { _parseSnsDomain } from "../utils/parseSnsDomain";

export interface RecordVerificationParams {
  domain: string;
  record: Record;
  owner: Address;
  payer: Address;
  verifier: Address;
}

export const _getRecordAndParentAddress = async ({
  domain,
  record,
}: {
  domain: string;
  record: Record;
}) => {
  let { domainAddress, isSub, parentAddress } = await getDomainAddress({
    domain: `${record}.${domain}`,
    record: RecordVersion.V2,
  });

  if (isSub) {
    parentAddress = (await getDomainAddress({ domain })).domainAddress;
  }

  if (!parentAddress) {
    throw new InvalidParentError("Parent could not be found");
  }

  return { domainAddress, parentAddress };
};

export const _buildValidateSolanaSignatureInstruction = async ({
  staleness,
  domain,
  record,
  owner,
  payer,
  verifier,
}: RecordVerificationParams & {
  staleness: boolean;
}): Promise<Instruction> => {
  _parseSnsDomain(domain);

  const { domainAddress, parentAddress } = await _getRecordAndParentAddress({
    domain,
    record,
  });

  return new ValidateSolanaSignatureInstruction({
    staleness,
  }).getInstruction(
    RECORDS_PROGRAM_ADDRESS,
    SYSTEM_PROGRAM_ADDRESS,
    NAME_PROGRAM_ADDRESS,
    payer,
    domainAddress,
    parentAddress,
    owner,
    CENTRAL_STATE_DOMAIN_RECORDS,
    verifier
  );
};
