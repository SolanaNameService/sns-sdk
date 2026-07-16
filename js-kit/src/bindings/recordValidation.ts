import { Address, Instruction } from "@solana/kit";

import {
  CENTRAL_STATE_DOMAIN_RECORDS,
  NAME_PROGRAM_ADDRESS,
  RECORDS_PROGRAM_ADDRESS,
  SYSTEM_PROGRAM_ADDRESS,
} from "../constants/addresses";
import { getSnsDomainAddress } from "../domain/getSnsDomainAddress";
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

/**
 * Derives the V2 record account and the domain account that owns that record.
 *
 * @param params Record derivation parameters
 * @param params.domain TLD-trimmed SNS domain or subdomain name
 * @param params.record Record type
 * @returns Derived V2 record account address and owning domain/subdomain account address.
 * @throws InvalidParentError If the owning domain account cannot be resolved.
 */
export const _getRecordAndParentAddress = async ({
  domain,
  record,
}: {
  domain: string;
  record: Record;
}) => {
  let { domainAddress, isSub, parentAddress } = await getSnsDomainAddress({
    domain: `${record}.${domain}`,
    record: RecordVersion.V2,
  });

  if (isSub) {
    parentAddress = (await getSnsDomainAddress({ domain })).domainAddress;
  }

  if (!parentAddress) {
    throw new InvalidParentError("Parent could not be found");
  }

  return { domainAddress, parentAddress };
};

/**
 * Builds the SNS records program's Solana-signature validation instruction.
 *
 * @param params Validation instruction parameters
 * @param params.staleness Whether to build the staleness-verifier instruction mode
 * @param params.domain Full `.sns` domain or subdomain name
 * @param params.record Record type
 * @param params.owner Current owner of the domain
 * @param params.payer Fee payer for the instruction
 * @param params.verifier Verifier account used by the record validation instruction
 * @returns Transaction instruction.
 * @throws InvalidParentError If the owning domain account cannot be resolved.
 */
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
  const trimmedDomain = _parseSnsDomain(domain);

  const { domainAddress, parentAddress } = await _getRecordAndParentAddress({
    domain: trimmedDomain,
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
