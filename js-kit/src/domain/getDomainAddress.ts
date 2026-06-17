import {
  CENTRAL_STATE_DOMAIN_RECORDS,
  SNS_ROOT_DOMAIN_ACCOUNT,
} from "../constants/addresses";
import { InvalidInputError } from "../errors";
import { RecordVersion } from "../types/record";
import { _deriveAddress } from "../utils/deriveAddress";
import { parseSupportedTld } from "../utils/tld";

interface GetDomainAddressParams {
  domain: string;
  record?: RecordVersion;
}

/**
 * Derives the address of a domain, a subdomain, or a record.
 *
 * @param params - An object containing the following properties:
 *   - `domain`: The full domain name to process, including a .sns or .sol suffix.
 *   - `record`: (Optional) The record version. Only provide if the domain being resolved is a record.
 * @returns A promise that resolves to an object containing the derived address and additional metadata.
 */
export const getDomainAddress = async ({
  domain,
  record,
}: GetDomainAddressParams) => {
  [domain] = parseSupportedTld(domain);

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
