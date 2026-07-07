import { Address, GetAccountInfoApi, Rpc } from "@solana/kit";

import { NoAccountDataError } from "../errors";
import { RegistryState } from "../states/registry";
import { deserializeReverse } from "./deserializers/deserializeReverse";
import { getReverseAddressFromDomainAddress } from "./getReverseAddressFromDomainAddress";

interface ReverseLookupParams {
  rpc: Rpc<GetAccountInfoApi>;
  domainAddress: Address;
  parentAddress?: Address;
}

/**
 * Performs a reverse lookup for a domain address.
 *
 * @param params Reverse lookup parameters
 * @param params.rpc RPC client implementing account lookup
 * @param params.domainAddress Domain address to reverse look up
 * @param params.parentAddress Optional parent domain address for subdomain reverse lookups
 * @returns Human-readable domain name.
 * @throws NoAccountDataError If the registry data is empty.
 */
export async function reverseLookup({
  rpc,
  domainAddress,
  parentAddress,
}: ReverseLookupParams): Promise<string> {
  const reverseAddress = await getReverseAddressFromDomainAddress({
    domainAddress,
    parentAddress,
  });

  const registry = await RegistryState.retrieve(rpc, reverseAddress);
  if (!registry.data) {
    throw new NoAccountDataError("The registry data is empty");
  }

  return deserializeReverse({
    data: registry.data,
    trimFirstNullByte: !!parentAddress,
  });
}
