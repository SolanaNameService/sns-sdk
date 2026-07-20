import { getSnsDomainAddress } from "../domain/getSnsDomainAddress";
import { Record, RecordVersion } from "../types/record";

interface GetRecordV1AddressParams {
  domain: string;
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
