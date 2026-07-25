import { getSnsDomainAddress } from "../domain/getSnsDomainAddress";
import { getReverseAddressFromDomainAddress } from "./getReverseAddressFromDomainAddress";

/**
 * Derives the reverse lookup account address for a TLD-trimmed SNS domain.
 *
 * @param domain TLD-trimmed SNS domain name
 * @returns The reverse lookup account address.
 *
 * @example
 * ```ts
 * const address = await getReverseAddress("example");
 * ```
 */
export const getReverseAddress = async (domain: string) => {
  const { domainAddress, parentAddress } = await getSnsDomainAddress({
    domain,
  });

  return getReverseAddressFromDomainAddress({
    domainAddress,
    parentAddress,
  });
};
