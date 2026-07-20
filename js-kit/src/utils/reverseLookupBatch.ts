import { Address, GetMultipleAccountsApi, Rpc } from "@solana/kit";

import { RegistryState } from "../states/registry";
import { deserializeReverse } from "./deserializers/deserializeReverse";
import { getReverseAddressFromDomainAddress } from "./getReverseAddressFromDomainAddress";

interface ReverseLookupBatchParams {
  rpc: Rpc<GetMultipleAccountsApi>;
  domainAddresses: Address[];
}

/**
 * Performs reverse lookups for domain addresses.
 *
 * @param params Reverse lookup parameters
 * @param params.rpc RPC client implementing multiple-account lookup
 * @param params.domainAddresses Domain addresses to reverse look up
 * @returns Human-readable domain names, or `undefined` when reverse account data is unavailable.
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
