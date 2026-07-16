import {
  GetAccountInfoApi,
  GetTokenLargestAccountsApi,
  Rpc,
} from "@solana/kit";

import { getSnsNftOwner } from "../nft/getSnsNftOwner";
import { RegistryState } from "../states/registry";
import { getSnsDomainAddress } from "./getSnsDomainAddress";

interface GetSnsDomainOwnerParams {
  rpc: Rpc<GetAccountInfoApi & GetTokenLargestAccountsApi>;
  domain: string;
}

/**
 * Resolves the owner of a TLD-trimmed SNS domain without applying public
 * TLD-support or legacy `.sol` cutoff policy.
 *
 * This internal helper is intended for public read methods that have already
 * validated and trimmed the full domain name.
 *
 * @param params Owner retrieval parameters
 * @param params.rpc RPC client implementing account and token-largest-account APIs
 * @param params.domain TLD-trimmed SNS domain name
 * @returns The tokenized domain owner when present, otherwise the registry owner
 */
export const _getSnsDomainOwner = async ({
  rpc,
  domain,
}: GetSnsDomainOwnerParams) => {
  const { domainAddress } = await getSnsDomainAddress({ domain });
  const [registry, nftOwner] = await Promise.all([
    RegistryState.retrieve(rpc, domainAddress),
    getSnsNftOwner({ rpc, domainAddress }),
  ]);
  return nftOwner || registry.owner;
};
