import {
  CENTRAL_STATE_DOMAIN_RECORDS,
  SNS_ROOT_DOMAIN_ACCOUNT,
} from "../constants/addresses";
import { InvalidInputError } from "../errors";
import { RecordVersion } from "../types/record";
import { _deriveAddress } from "../utils/deriveAddress";

interface GetSnsDomainAddressParams {
  domain: string;
  record?: RecordVersion;
}

/**
 * Derives the address of a domain, subdomain, or record account.
 *
 * @param params Derivation parameters
 * @param params.domain TLD-trimmed SNS domain name
 * @param params.record Optional record account version for record derivation
 * @returns Derived account address and metadata describing top-level, subdomain, or sub-record derivation.
 */
export const getSnsDomainAddress = async ({
  domain,
  record,
}: GetSnsDomainAddressParams) => {
  const recordClass =
    record === RecordVersion.V2 ? CENTRAL_STATE_DOMAIN_RECORDS : undefined;
  const recordPrefix =
    {
      [RecordVersion.V2]: "\x02",
      [RecordVersion.V1]: "\x01",
    }[record as RecordVersion] || "\x00";
  const splitted = domain.split(".");

  if (splitted.length === 2) {
    const parentAddress = await _deriveAddress(
      splitted[1],
      SNS_ROOT_DOMAIN_ACCOUNT
    );
    const domainAddress = await _deriveAddress(
      recordPrefix + splitted[0],
      parentAddress,
      recordClass
    );

    return { domainAddress, parentAddress, isSub: true };
  } else if (splitted.length === 3 && !!record) {
    // Parent domain
    const parentAddress = await _deriveAddress(
      splitted[2],
      SNS_ROOT_DOMAIN_ACCOUNT
    );

    // Sub domain
    const subAddress = await _deriveAddress("\0" + splitted[1], parentAddress);

    // Sub record
    const domainAddress = await _deriveAddress(
      recordPrefix + splitted[0],
      subAddress,
      recordClass
    );

    return { domainAddress, parentAddress, isSub: true, isSubRecord: true };
  } else if (splitted.length >= 3) {
    throw new InvalidInputError("The domain is malformed");
  }

  const domainAddress = await _deriveAddress(domain, SNS_ROOT_DOMAIN_ACCOUNT);

  return { domainAddress, isSub: false };
};
