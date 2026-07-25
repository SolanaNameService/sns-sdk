import {
  Address,
  Base58EncodedBytes,
  GetProgramAccountsApi,
  Rpc,
} from "@solana/kit";

import { addressCodec, base64Codec } from "../codecs";
import {
  NAME_PROGRAM_ADDRESS,
  SNS_ROOT_DOMAIN_ACCOUNT,
} from "../constants/addresses";

/**
 * Parameters for retrieving all SNS domains.
 *
 * @example
 * ```ts
 * const params: GetAllSnsDomainsParams = { rpc };
 * ```
 */
export interface GetAllSnsDomainsParams {
  /** RPC client. */
  rpc: Rpc<GetProgramAccountsApi>;
}

/**
 * A top-level SNS domain account.
 *
 * @example
 * ```ts
 * const domain: GetAllSnsDomainsResult = { domainAddress, owner };
 * ```
 */
export interface GetAllSnsDomainsResult {
  /** Domain account address. */
  domainAddress: Address;
  /** Registry owner address. */
  owner: Address;
}

/**
 * Retrieves all top-level SNS domain accounts.
 *
 * @param params Domain retrieval parameters
 * @param params.rpc RPC client implementing program account lookup
 * @returns Domain account addresses and owners.
 *
 * @example
 * ```ts
 * const domains = await getAllSnsDomains({ rpc });
 * ```
 */
export const getAllSnsDomains = async ({
  rpc,
}: GetAllSnsDomainsParams): Promise<GetAllSnsDomainsResult[]> => {
  const accounts = await rpc
    .getProgramAccounts(NAME_PROGRAM_ADDRESS, {
      encoding: "base64",
      filters: [
        {
          memcmp: {
            offset: 0n,
            bytes: SNS_ROOT_DOMAIN_ACCOUNT as string as Base58EncodedBytes,
            encoding: "base58",
          },
        },
      ],
      dataSlice: { offset: 32, length: 32 },
    })
    .send();

  return accounts.map(({ account: { data }, pubkey }) => ({
    domainAddress: pubkey,
    owner: addressCodec.decode(base64Codec.encode(data[0])),
  }));
};
