import { Address, Instruction } from "@solana/kit";

import {
  CENTRAL_STATE_DOMAIN_RECORDS,
  NAME_PROGRAM_ADDRESS,
  RECORDS_PROGRAM_ADDRESS,
  SYSTEM_PROGRAM_ADDRESS,
} from "../constants/addresses";
import { getSnsDomainAddress } from "../domain/getSnsDomainAddress";
import { InvalidParentError } from "../errors";
import { AllocateAndPostRecordInstruction } from "../instructions/allocateAndPostRecordInstruction";
import { Record, RecordVersion } from "../types/record";
import { _parseSnsDomain } from "../utils/parseSnsDomain";
import { serializeRecordContent } from "../utils/serializers/serializeRecordContent";

/**
 * Parameters for creating a domain record.
 *
 * @example
 * ```ts
 * const params: CreateRecordParams = {
 *   domain: "example.sns",
 *   record: Record.Url,
 *   content: "https://example.com",
 *   owner,
 *   payer,
 * };
 * ```
 */
export interface CreateRecordParams {
  /** Full `.sns` domain name. */
  domain: string;
  /** Record type. */
  record: Record;
  /** Record content. */
  content: string;
  /** Current domain owner. */
  owner: Address;
  /** Instruction fee payer. */
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
 *
 * @example
 * ```ts
 * const instruction = await createRecord({
 *   domain: "example.sns",
 *   record: Record.Url,
 *   content: "https://example.com",
 *   owner,
 *   payer,
 * });
 * ```
 */
export const createRecord = async ({
  domain,
  record,
  content,
  owner,
  payer,
}: CreateRecordParams): Promise<Instruction> => {
  const trimmedDomain = _parseSnsDomain(domain);

  let { domainAddress, parentAddress, isSub } = await getSnsDomainAddress({
    domain: `${record}.${trimmedDomain}`,
    record: RecordVersion.V2,
  });

  if (isSub) {
    parentAddress = (await getSnsDomainAddress({ domain: trimmedDomain }))
      .domainAddress;
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
