import { Address } from "@solana/kit";

import { REVERSE_LOOKUP_CLASS } from "../constants/addresses";
import { _deriveAddress } from "./deriveAddress";

interface GetReverseAddressFromDomainAddressParams {
  domainAddress: Address;
  parentAddress?: Address;
}

/**
 * Derives the reverse lookup account address from a domain address.
 *
 * @param params Reverse lookup derivation parameters
 * @param params.domainAddress Domain account address to reverse look up
 * @param params.parentAddress Optional parent address for subdomain reverse lookups
 * @returns The reverse lookup account address.
 */
export const getReverseAddressFromDomainAddress = async ({
  domainAddress,
  parentAddress,
}: GetReverseAddressFromDomainAddressParams): Promise<Address> => {
  return await _deriveAddress(
    domainAddress,
    parentAddress,
    REVERSE_LOOKUP_CLASS
  );
};
