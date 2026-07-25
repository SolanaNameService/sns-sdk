import {
  Address,
  Base58EncodedBytes,
  GetMultipleAccountsApi,
  GetProgramAccountsApi,
  Rpc,
} from "@solana/kit";

import {
  NAME_PROGRAM_ADDRESS,
  SNS_ROOT_DOMAIN_ACCOUNT,
} from "../constants/addresses";
import { reverseLookupBatch } from "../utils/reverseLookupBatch";

/**
 * Parameters for retrieving SNS domains owned by an address.
 *
 * @example
 * ```ts
 * const params: GetSnsDomainsForAddressParams = { rpc, address };
 * ```
 */
export interface GetSnsDomainsForAddressParams {
  /** RPC client. */
  rpc: Rpc<GetProgramAccountsApi & GetMultipleAccountsApi>;
  /** Owner address. */
  address: Address;
}

/**
 * An SNS domain owned directly by a registry address.
 *
 * @example
 * ```ts
 * const domain: GetSnsDomainsForAddressResult = {
 *   domain: "example",
 *   domainAddress,
 * };
 * ```
 */
export interface GetSnsDomainsForAddressResult {
  /** TLD-less domain name. */
  domain: string;
  /** Domain account address. */
  domainAddress: Address;
}

/**
 * Retrieves directly registry-owned top-level SNS domains for an address.
 *
 * Tokenized domains and subdomains are not included. Entries without reverse
 * lookup results are omitted.
 *
 * @param params Domain retrieval parameters
 * @param params.rpc RPC client implementing program account and multiple-account APIs
 * @param params.address Address whose directly registry-owned SNS domains are retrieved
 * @returns Domain records with names without a TLD suffix and domain addresses.
 *
 * @example
 * ```ts
 * const domains = await getSnsDomainsForAddress({ rpc, address });
 * ```
 */
export const getSnsDomainsForAddress = async ({
  rpc,
  address,
}: GetSnsDomainsForAddressParams): Promise<GetSnsDomainsForAddressResult[]> => {
  const results = await rpc
    .getProgramAccounts(NAME_PROGRAM_ADDRESS, {
      encoding: "base64",
      filters: [
        {
          memcmp: {
            offset: 32n,
            bytes: address as string as Base58EncodedBytes,
            encoding: "base58",
          },
        },
        {
          memcmp: {
            offset: 0n,
            bytes: SNS_ROOT_DOMAIN_ACCOUNT as string as Base58EncodedBytes,
            encoding: "base58",
          },
        },
      ],
      dataSlice: {
        offset: 0,
        length: 0,
      },
    })
    .send();

  const domains = await reverseLookupBatch({
    rpc,
    domainAddresses: results.map((r) => r.pubkey),
  });

  return domains
    .map((domain, idx) =>
      domain
        ? {
            domain,
            domainAddress: results[idx].pubkey,
          }
        : undefined
    )
    .filter((e) => e !== undefined);
};
