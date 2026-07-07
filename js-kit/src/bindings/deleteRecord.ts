import { Address, Instruction } from "@solana/kit";

import {
  CENTRAL_STATE_DOMAIN_RECORDS,
  NAME_PROGRAM_ADDRESS,
  RECORDS_PROGRAM_ADDRESS,
  SYSTEM_PROGRAM_ADDRESS,
} from "../constants/addresses";
import { getDomainAddress } from "../domain/getDomainAddress";
import { InvalidParentError } from "../errors";
import { DeleteRecordInstruction } from "../instructions/deleteRecordInstruction";
import { Record, RecordVersion } from "../types/record";
import { _parseSnsDomain } from "../utils/parseSnsDomain";

interface DeleteRecordParams {
  domain: string;
  record: Record;
  owner: Address;
  payer: Address;
}

/**
 * Builds an instruction to delete a V2 record for a `.sns` domain or subdomain.
 *
 * @param params Record deletion parameters
 * @param params.domain Full `.sns` domain or subdomain name
 * @param params.record Record type
 * @param params.owner Current owner of the domain
 * @param params.payer Fee payer for the instruction
 * @returns Transaction instruction.
 */
export const deleteRecord = async ({
  domain,
  record,
  owner,
  payer,
}: DeleteRecordParams): Promise<Instruction> => {
  _parseSnsDomain(domain);

  let { domainAddress, parentAddress, isSub } = await getDomainAddress({
    domain: `${record}.${domain}`,
    record: RecordVersion.V2,
  });

  if (isSub) {
    parentAddress = (await getDomainAddress({ domain })).domainAddress;
  }

  if (!parentAddress) {
    throw new InvalidParentError("Parent could not be found");
  }

  const ix = new DeleteRecordInstruction().getInstruction(
    RECORDS_PROGRAM_ADDRESS,
    SYSTEM_PROGRAM_ADDRESS,
    NAME_PROGRAM_ADDRESS,
    payer,
    domainAddress,
    parentAddress,
    owner,
    CENTRAL_STATE_DOMAIN_RECORDS
  );

  return ix;
};
