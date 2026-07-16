import {
  GetAccountInfoApi,
  GetTokenLargestAccountsApi,
  Rpc,
} from "@solana/kit";

import { getSnsNftOwner } from "../nft/getSnsNftOwner";
import { RegistryState } from "../states/registry";
import { parseSupportedTld } from "../utils/tld";
import { getSnsDomainAddress } from "./getSnsDomainAddress";

interface GetDomainOwnerParams {
  rpc: Rpc<GetAccountInfoApi & GetTokenLargestAccountsApi>;
  domain: string;
}

/**
 * Retrieves the owner of the specified domain. If the domain is tokenized,
 * the NFT's owner is returned; otherwise, the registry owner is returned.
 *
 * @param params Domain owner retrieval parameters
 * @param params.rpc RPC client implementing account and token-largest-account APIs
 * @param params.domain Full domain name including a `.sns` or `.sol` suffix
 * @returns The domain owner address.
 */
export const getDomainOwner = async ({ rpc, domain }: GetDomainOwnerParams) => {
  const [trimmedDomain] = parseSupportedTld(domain);
  const { domainAddress } = await getSnsDomainAddress({
    domain: trimmedDomain,
  });
  const [registry, nftOwner] = await Promise.all([
    RegistryState.retrieve(rpc, domainAddress),
    getSnsNftOwner({ rpc, domainAddress }),
  ]);
  return nftOwner || registry.owner;
};
