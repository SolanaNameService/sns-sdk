import {
  GetAccountInfoApi,
  GetTokenLargestAccountsApi,
  Rpc,
} from "@solana/kit";

import { _parseSnsDomain } from "../utils/parseSnsDomain";
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
  rpc: Rpc<GetAccountInfoApi & GetTokenLargestAccountsApi>;
  /** Full `.sns` domain name. */
  domain: string;
}

/**
 * Retrieves the owner of the specified domain. If the domain is tokenized,
 * the NFT's owner is returned; otherwise, the registry owner is returned.
 *
 * @param params Domain owner retrieval parameters
 * @param params.rpc RPC client implementing account and token-largest-account APIs
 * @param params.domain Full `.sns` domain name
 * @returns The domain owner address.
 *
 * @example
 * ```ts
 * const owner = await getDomainOwner({ rpc, domain: "example.sns" });
 * ```
 */
export const getDomainOwner = async ({ rpc, domain }: GetDomainOwnerParams) => {
  const trimmedDomain = _parseSnsDomain(domain);
  return _getSnsDomainOwner({ rpc, domain: trimmedDomain });
};
