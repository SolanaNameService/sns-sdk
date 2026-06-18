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

/**
 * Derives the V2 record account and the domain account that owns that record.
 *
 * @param params - An object containing the following properties:
 *   - `domain`: The full `.sns` domain or subdomain that owns the record.
 *   - `record`: The record type whose V2 record account should be derived.
 * @returns A promise resolving to the derived V2 record account address as
 *   `domainAddress` and the owning domain/subdomain account address as
 *   `parentAddress`.
 * @throws InvalidParentError - If the owning domain account cannot be resolved.
 */
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

/**
 * Builds the SNS records program's Solana-signature validation instruction.
 *
 * @param params - An object containing the following properties:
 *   - `staleness`: The low-level program mode flag. `true` updates staleness
 *     verifier metadata; `false` validates Right of Association.
 *   - `domain`: The full `.sns` domain or subdomain that owns the record.
 *   - `record`: The record type whose V2 record account is being validated.
 *   - `owner`: The domain owner account passed to the records program.
 *   - `payer`: The fee payer for the validation instruction.
 *   - `verifier`: The Solana verifier account used by the selected validation
 *     mode.
 * @returns A promise resolving to the `ValidateSolanaSignatureInstruction`
 *   instruction for the SNS records program.
 * @throws InvalidParentError - If the owning domain account cannot be resolved.
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
