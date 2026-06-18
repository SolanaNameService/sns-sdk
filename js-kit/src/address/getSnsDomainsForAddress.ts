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

interface GetSnsDomainsForAddressParams {
  rpc: Rpc<GetProgramAccountsApi & GetMultipleAccountsApi>;
  address: Address;
}

interface Result {
  domain: string;
  domainAddress: Address;
}

/**
 * Retrieves the SNS domains owned by a given address.
 *
 * @param params - An object containing the following properties:
 *   - `rpc`: An RPC interface implementing GetProgramAccountsApi and GetMultipleAccountsApi.
 *   - `address`: The address for which to retrieve associated domains.
 * @returns A promise resolving to an array of objects containing domain (without .sns suffix) and domainAddress.
 */
export const getSnsDomainsForAddress = async ({
  rpc,
  address,
}: GetSnsDomainsForAddressParams): Promise<Result[]> => {
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
