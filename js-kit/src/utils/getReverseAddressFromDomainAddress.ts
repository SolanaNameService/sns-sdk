import { Address } from "@solana/kit";

import { REVERSE_LOOKUP_CLASS } from "../constants/addresses";
import { _deriveAddress } from "./deriveAddress";

/**
 * Parameters for deriving a reverse lookup address.
 *
 * @example
 * ```ts
 * const params: GetReverseAddressFromDomainAddressParams = { domainAddress };
 * ```
 */
export interface GetReverseAddressFromDomainAddressParams {
  /** Domain account address. */
  domainAddress: Address;
  /** Parent domain address for a subdomain. */
  parentAddress?: Address;
}

/**
 * Derives the reverse lookup account address from a domain address.
 *
 * @param params Reverse lookup derivation parameters
 * @param params.domainAddress Domain account address to reverse look up
 * @param params.parentAddress Optional parent address for subdomain reverse lookups
 * @returns The reverse lookup account address.
 *
 * @example
 * ```ts
 * const address = await getReverseAddressFromDomainAddress({ domainAddress });
 * ```
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
