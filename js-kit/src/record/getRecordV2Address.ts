import { Address } from "@solana/kit";

import { CENTRAL_STATE_DOMAIN_RECORDS } from "../constants/addresses";
import { getDomainAddress } from "../domain/getDomainAddress";
import { Record } from "../types/record";
import { _deriveAddress } from "../utils/deriveAddress";

interface GetRecordV2AddressParams {
  domain: string;
  record: Record;
}

/**
 * Derives the address of a V2 record account.
 *
 * @param params Record address derivation parameters
 * @param params.domain Full domain name including a `.sns` or `.sol` suffix
 * @param params.record Record type
 * @returns The derived V2 record account address.
 */
export const getRecordV2Address = async ({
  domain,
  record,
}: GetRecordV2AddressParams): Promise<Address> => {
  const { domainAddress } = await getDomainAddress({ domain });

  return await _deriveAddress(
    `\x02${record}`,
    domainAddress,
    CENTRAL_STATE_DOMAIN_RECORDS
  );
};
