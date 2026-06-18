import { getDomainAddress } from "../domain/getDomainAddress";
import { getReverseAddressFromDomainAddress } from "./getReverseAddressFromDomainAddress";

/**
 * Derives the reverse lookup account address for a full `.sns` or `.sol` domain.
 *
 * @param domain The full domain name, including a `.sns` or `.sol` suffix.
 * @returns A promise that resolves to the reverse lookup account address.
 */
export const getReverseAddress = async (domain: string) => {
  const { domainAddress, parentAddress } = await getDomainAddress({ domain });

  return getReverseAddressFromDomainAddress({
    domainAddress,
    parentAddress,
  });
};
