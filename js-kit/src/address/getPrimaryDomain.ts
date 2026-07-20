import {
  Address,
  GetAccountInfoApi,
  GetTokenLargestAccountsApi,
  Rpc,
} from "@solana/kit";

import {
  NAME_OFFERS_ADDRESS,
  SNS_ROOT_DOMAIN_ACCOUNT,
} from "../constants/addresses";
import { getSnsNftOwner } from "../nft/getSnsNftOwner";
import { PrimaryDomainState } from "../states/primaryDomain";
import { RegistryState } from "../states/registry";
import { reverseLookup } from "../utils/reverseLookup";

interface GetPrimaryDomainParams {
  rpc: Rpc<GetAccountInfoApi & GetTokenLargestAccountsApi>;
  walletAddress: Address;
}

/**
 * Retrieves the primary SNS domain associated with a wallet address.
 *
 * Returned domain names omit the TLD suffix; subdomain primary names can
 * include parent labels such as `sub.parent`.
 *
 * @param params Primary domain retrieval parameters
 * @param params.rpc RPC client implementing account and token-largest-account APIs
 * @param params.walletAddress Wallet address whose primary domain is retrieved
 * @returns Primary domain address, domain name, and stale status.
 */
export const getPrimaryDomain = async ({
  rpc,
  walletAddress,
}: GetPrimaryDomainParams): Promise<{
  domainAddress: Address;
  domainName: string;
  stale: boolean;
}> => {
  const primaryAddress = await PrimaryDomainState.getAddress(
    NAME_OFFERS_ADDRESS,
    walletAddress
  );
  const primary = await PrimaryDomainState.retrieve(rpc, primaryAddress);
  const [registry, nftOwner] = await Promise.all([
    RegistryState.retrieve(rpc, primary.nameAccount),
    getSnsNftOwner({ rpc, domainAddress: primary.nameAccount }),
  ]);
  const domainOwner = nftOwner || registry.owner;
  const isSub = registry.parentName !== SNS_ROOT_DOMAIN_ACCOUNT;

  const lookups = [
    reverseLookup({
      rpc,
      domainAddress: primary.nameAccount,
      parentAddress: isSub ? registry.parentName : undefined,
    }),
  ];

  if (isSub) {
    lookups.push(reverseLookup({ rpc, domainAddress: registry.parentName }));
  }

  const domainName = (await Promise.all(lookups)).join(".");

  return {
    domainAddress: primary.nameAccount,
    domainName,
    stale: walletAddress !== domainOwner,
  };
};
