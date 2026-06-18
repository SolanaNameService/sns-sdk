import { Base58EncodedBytes, GetProgramAccountsApi, Rpc } from "@solana/kit";

import { addressCodec, base64Codec } from "../codecs";
import {
  NAME_PROGRAM_ADDRESS,
  SNS_ROOT_DOMAIN_ACCOUNT,
} from "../constants/addresses";

interface GetAllSnsDomainsParams {
  rpc: Rpc<GetProgramAccountsApi>;
}

/**
 * Retrieves the addresses of all .sns domains.
 *
 * @param params - An object containing the following properties:
 *   - `rpc`: An RPC interface implementing GetProgramAccountsApi.
 * @returns A promise that resolves to an array of objects representing domain addresses and owners.
 */
export const getAllSnsDomains = async ({ rpc }: GetAllSnsDomainsParams) => {
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
