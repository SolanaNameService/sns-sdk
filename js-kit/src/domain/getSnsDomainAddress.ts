import { Address } from "@solana/kit";

import {
  CENTRAL_STATE_DOMAIN_RECORDS,
  SNS_ROOT_DOMAIN_ACCOUNT,
} from "../constants/addresses";
import { InvalidInputError } from "../errors";
import { RecordVersion } from "../types/record";
import { _deriveAddress } from "../utils/deriveAddress";

/**
 * Parameters for deriving an SNS domain address.
 *
 * @example
 * ```ts
 * const params: GetSnsDomainAddressParams = { domain: "example" };
 * ```
 */
export interface GetSnsDomainAddressParams {
  /** TLD-less domain name. */
  domain: string;
  /** Record version. */
  record?: RecordVersion;
}

/**
 * A derived SNS domain address.
 *
 * @example
 * ```ts
 * const derived: GetSnsDomainAddressResult = {
 *   domainAddress,
 *   isSub: false,
 * };
 * ```
 */
export interface GetSnsDomainAddressResult {
  /** Derived account address. */
  domainAddress: Address;
  /** Parent domain address for subdomains. */
  parentAddress?: Address;
  /** Whether the input is a subdomain. */
  isSub: boolean;
  /** Whether the input is a subdomain record. */
  isSubRecord?: boolean;
}

/**
 * Derives the address of a domain, subdomain, or record account.
 *
 * @param params Derivation parameters
 * @param params.domain TLD-trimmed SNS domain name
 * @param params.record Optional record account version for record derivation
 * @returns Derived account address and metadata describing top-level, subdomain, or sub-record derivation.
 *
 * @example
 * ```ts
 * const derived = await getSnsDomainAddress({ domain: "example" });
 * ```
 */
export const getSnsDomainAddress = async ({
  domain,
  record,
}: GetSnsDomainAddressParams): Promise<GetSnsDomainAddressResult> => {
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
