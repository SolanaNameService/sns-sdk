import { getSnsDomainAddress } from "../domain/getSnsDomainAddress";
import { Record, RecordVersion } from "../types/record";

/**
 * Parameters for deriving a V1 record address.
 *
 * @example
 * ```ts
 * const params: GetRecordV1AddressParams = { domain: "example", record: Record.Url };
 * ```
 */
export interface GetRecordV1AddressParams {
  /** TLD-less domain name. */
  domain: string;
  /** Record type. */
  record: Record;
}

/**
 * Derives the address of a V1 record account.
 *
 * The V1 account is derived by prefixing the record label to the domain name.
 *
 * @param params Record address derivation parameters
 * @param params.domain TLD-trimmed SNS domain name
 * @param params.record Record type
 * @returns The derived V1 record account address.
 *
 * @example
 * ```ts
 * const address = await getRecordV1Address({ domain: "example", record: Record.Url });
 * ```
 */
export const getRecordV1Address = async ({
  domain,
  record,
}: GetRecordV1AddressParams) => {
  const { domainAddress } = await getSnsDomainAddress({
    domain: record + "." + domain,
    record: RecordVersion.V1,
  });

  return domainAddress;
};
