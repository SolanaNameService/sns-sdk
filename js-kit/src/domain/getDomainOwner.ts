import {
  GetAccountInfoApi,
  GetSlotApi,
  GetTokenLargestAccountsApi,
  Rpc,
} from "@solana/kit";

import { assertTldSupported } from "../utils/assertTldSupported";
import { _getSnsDomainOwner } from "./getSnsDomainOwner";

interface GetDomainOwnerParams {
  rpc: Rpc<GetAccountInfoApi & GetTokenLargestAccountsApi & GetSlotApi>;
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
  const [trimmedDomain] = await assertTldSupported({ rpc, domain });
  return _getSnsDomainOwner({ rpc, domain: trimmedDomain });
};
