import { getDomainAddress } from "../domain/getDomainAddress";
import { getReverseAddressFromDomainAddress } from "./getReverseAddressFromDomainAddress";

/**
 * Derives the reverse lookup account address for a full `.sns` or `.sol` domain.
 *
 * @param domain Full domain name including a `.sns` or `.sol` suffix
 * @returns The reverse lookup account address.
 */
export const getReverseAddress = async (domain: string) => {
  const { domainAddress, parentAddress } = await getDomainAddress({ domain });

  return getReverseAddressFromDomainAddress({
    domainAddress,
    parentAddress,
  });
};
