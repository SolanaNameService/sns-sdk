import { Address, GetMultipleAccountsApi, Rpc } from "@solana/kit";

import { RegistryState } from "../states/registry";
import { deserializeReverse } from "./deserializers/deserializeReverse";
import { getReverseAddressFromDomainAddress } from "./getReverseAddressFromDomainAddress";

/**
 * Parameters for batch reverse lookup.
 *
 * @example
 * ```ts
 * const params: ReverseLookupBatchParams = { rpc, domainAddresses };
 * ```
 */
export interface ReverseLookupBatchParams {
  /** RPC client. */
  rpc: Rpc<GetMultipleAccountsApi>;
  /** Domain account addresses. */
  domainAddresses: Address[];
}

/**
 * Performs reverse lookups for domain addresses.
 *
 * @param params Reverse lookup parameters
 * @param params.rpc RPC client implementing multiple-account lookup
 * @param params.domainAddresses Domain addresses to reverse look up
 * @returns Human-readable domain names, or `undefined` when reverse account data is unavailable.
 *
 * @example
 * ```ts
 * const domains = await reverseLookupBatch({ rpc, domainAddresses });
 * ```
 */
export async function reverseLookupBatch({
  rpc,
  domainAddresses,
}: ReverseLookupBatchParams): Promise<(string | undefined)[]> {
  const reverseLookupAddresses: Address[] = await Promise.all(
    domainAddresses.map((domainAddress) =>
      getReverseAddressFromDomainAddress({ domainAddress })
    )
  );
  const states = await RegistryState.retrieveBatch(rpc, reverseLookupAddresses);

  return states.map((state) => {
    return state?.data ? deserializeReverse({ data: state.data }) : undefined;
  });
}
