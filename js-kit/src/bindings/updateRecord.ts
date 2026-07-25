import { Address, Instruction } from "@solana/kit";

import {
  CENTRAL_STATE_DOMAIN_RECORDS,
  NAME_PROGRAM_ADDRESS,
  RECORDS_PROGRAM_ADDRESS,
  SYSTEM_PROGRAM_ADDRESS,
} from "../constants/addresses";
import { getSnsDomainAddress } from "../domain/getSnsDomainAddress";
import { InvalidParentError } from "../errors";
import { UpdateRecordInstruction } from "../instructions/updateRecordInstruction";
import { Record, RecordVersion } from "../types/record";
import { _parseSnsDomain } from "../utils/parseSnsDomain";
import { serializeRecordContent } from "../utils/serializers/serializeRecordContent";

/**
 * Parameters for updating a domain record.
 *
 * @example
 * ```ts
 * const params: UpdateRecordParams = {
 *   domain: "example.sns",
 *   record: Record.Url,
 *   content: "https://example.com",
 *   owner,
 *   payer,
 * };
 * ```
 */
export interface UpdateRecordParams {
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
 * Builds an instruction to update a V2 record for a `.sns` domain or subdomain.
 *
 * Record content is serialized according to SNS-IP 1.
 *
 * @param params Record update parameters
 * @param params.domain Full `.sns` domain or subdomain name
 * @param params.record Record type
 * @param params.content Record content
 * @param params.owner Current owner of the domain
 * @param params.payer Fee payer for the instruction
 * @returns Transaction instruction.
 *
 * @example
 * ```ts
 * const instruction = await updateRecord({
 *   domain: "example.sns",
 *   record: Record.Url,
 *   content: "https://example.com",
 *   owner,
 *   payer,
 * });
 * ```
 */
export const updateRecord = async ({
  domain,
  record,
  content,
  owner,
  payer,
}: UpdateRecordParams): Promise<Instruction> => {
  const trimmedDomain = _parseSnsDomain(domain);

  let { domainAddress, isSub, parentAddress } = await getSnsDomainAddress({
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

  const ix = new UpdateRecordInstruction({
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
