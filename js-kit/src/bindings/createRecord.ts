import { Address, Instruction } from "@solana/kit";

import {
  CENTRAL_STATE_DOMAIN_RECORDS,
  NAME_PROGRAM_ADDRESS,
  RECORDS_PROGRAM_ADDRESS,
  SYSTEM_PROGRAM_ADDRESS,
} from "../constants/addresses";
import { getDomainAddress } from "../domain/getDomainAddress";
import { InvalidParentError } from "../errors";
import { AllocateAndPostRecordInstruction } from "../instructions/allocateAndPostRecordInstruction";
import { Record, RecordVersion } from "../types/record";
import { _parseSnsDomain } from "../utils/parseSnsDomain";
import { serializeRecordContent } from "../utils/serializers/serializeRecordContent";

interface CreateRecordParams {
  domain: string;
  record: Record;
  content: string;
  owner: Address;
  payer: Address;
}

/**
 * Builds an instruction to create a V2 record for a `.sns` domain or subdomain.
 *
 * Record content is serialized according to SNS-IP 1.
 *
 * @param params Record creation parameters
 * @param params.domain Full `.sns` domain or subdomain name
 * @param params.record Record type
 * @param params.content Record content
 * @param params.owner Current owner of the domain
 * @param params.payer Fee payer for the instruction
 * @returns Transaction instruction.
 */
export const createRecord = async ({
  domain,
  record,
  content,
  owner,
  payer,
}: CreateRecordParams): Promise<Instruction> => {
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

  const ix = new AllocateAndPostRecordInstruction({
    record: `\x02${record}`,
    content: serializeRecordContent({ content, record }),
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

  return ix;
};
