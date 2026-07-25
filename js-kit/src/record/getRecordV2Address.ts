import { Address } from "@solana/kit";

import { CENTRAL_STATE_DOMAIN_RECORDS } from "../constants/addresses";
import { getSnsDomainAddress } from "../domain/getSnsDomainAddress";
import { Record } from "../types/record";
import { _deriveAddress } from "../utils/deriveAddress";

/**
 * Parameters for deriving a V2 record address.
 *
 * @example
 * ```ts
 * const params: GetRecordV2AddressParams = { domain: "example", record: Record.Url };
 * ```
 */
export interface GetRecordV2AddressParams {
  /** TLD-less domain name. */
  domain: string;
  /** Record type. */
  record: Record;
}

/**
 * Derives the address of a V2 record account.
 *
 * @param params Record address derivation parameters
 * @param params.domain TLD-trimmed SNS domain name
 * @param params.record Record type
 * @returns The derived V2 record account address.
 *
 * @example
 * ```ts
 * const address = await getRecordV2Address({ domain: "example", record: Record.Url });
 * ```
 */
export const getRecordV2Address = async ({
  domain,
  record,
}: GetRecordV2AddressParams): Promise<Address> => {
  const { domainAddress } = await getSnsDomainAddress({ domain });

  return await _deriveAddress(
    `\x02${record}`,
    domainAddress,
    CENTRAL_STATE_DOMAIN_RECORDS
  );
};
