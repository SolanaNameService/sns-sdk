import {
  GetAccountInfoApi,
  GetSlotApi,
  GetTokenLargestAccountsApi,
  Rpc,
} from "@solana/kit";

import { assertTldSupported } from "../utils/assertTldSupported";
import { _getSnsDomainOwner } from "./getSnsDomainOwner";

/**
 * Parameters for retrieving a domain owner.
 *
 * @example
 * ```ts
 * const params: GetDomainOwnerParams = { rpc, domain: "example.sns" };
 * ```
 */
export interface GetDomainOwnerParams {
  /** RPC client. */
  rpc: Rpc<GetAccountInfoApi & GetTokenLargestAccountsApi & GetSlotApi>;
  /** Full domain name. */
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
 *
 * @example
 * ```ts
 * const owner = await getDomainOwner({ rpc, domain: "example.sns" });
 * ```
 */
export const getDomainOwner = async ({ rpc, domain }: GetDomainOwnerParams) => {
  const [trimmedDomain] = await assertTldSupported({ rpc, domain });
  return _getSnsDomainOwner({ rpc, domain: trimmedDomain });
};
