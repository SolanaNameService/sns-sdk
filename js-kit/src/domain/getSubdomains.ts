import {
  Address,
  Base58EncodedBytes,
  GetProgramAccountsApi,
  GetSlotApi,
  Rpc,
} from "@solana/kit";

import { addressCodec, base64Codec } from "../codecs";
import {
  NAME_PROGRAM_ADDRESS,
  REVERSE_LOOKUP_CLASS,
} from "../constants/addresses";
import { deserializeReverse } from "../utils/deserializers/deserializeReverse";
import { assertTldSupported } from "../utils/assertTldSupported";
import { getReverseAddressFromDomainAddress } from "../utils/getReverseAddressFromDomainAddress";
import { getSnsDomainAddress } from "./getSnsDomainAddress";

interface GetSubdomainsParams {
  rpc: Rpc<GetProgramAccountsApi & GetSlotApi>;
  domain: string;
}

interface Result {
  subdomain: string;
  owner: Address;
}

/**
 * Retrieves subdomains under a parent domain, including their owners.
 *
 * Entries without reverse lookup data are omitted. Passing a subdomain returns
 * an empty array.
 *
 * @param params Subdomain retrieval parameters
 * @param params.rpc RPC client implementing program account lookup
 * @param params.domain Full parent domain name including a `.sns` or `.sol` suffix
 * @returns Subdomain names and owner addresses.
 */
export const getSubdomains = async ({
  rpc,
  domain,
}: GetSubdomainsParams): Promise<Result[]> => {
  const [trimmedDomain] = await assertTldSupported({ rpc, domain });
  const { domainAddress, isSub } = await getSnsDomainAddress({
    domain: trimmedDomain,
  });

  if (isSub) return [];

  const getReversesAsync = rpc
    .getProgramAccounts(NAME_PROGRAM_ADDRESS, {
      encoding: "base64",
      filters: [
        {
          memcmp: {
            offset: 0n,
            bytes: domainAddress as string as Base58EncodedBytes,
            encoding: "base58",
          },
        },
        {
          memcmp: {
            offset: 64n,
            bytes: REVERSE_LOOKUP_CLASS as string as Base58EncodedBytes,
            encoding: "base58",
          },
        },
      ],
    })
    .send();

  const getSubsAsync = rpc
    .getProgramAccounts(NAME_PROGRAM_ADDRESS, {
      encoding: "base64",
      filters: [
        {
          memcmp: {
            offset: 0n,
            bytes: domainAddress as string as Base58EncodedBytes,
            encoding: "base58",
          },
        },
      ],
      dataSlice: { offset: 32, length: 32 },
    })
    .send();

  const [reverses, subs] = await Promise.all([getReversesAsync, getSubsAsync]);

  const map = new Map<string, string | undefined>(
    reverses.map((e) => [
      e.pubkey,
      deserializeReverse({
        data: base64Codec.encode(e.account.data[0]).slice(96),
        trimFirstNullByte: true,
      }),
    ])
  );

  const result = await Promise.all(
    subs.map((sub) =>
      getReverseAddressFromDomainAddress({
        domainAddress: sub.pubkey,
        parentAddress: domainAddress,
      }).then((revKey) => {
        const subdomain = map.get(revKey);
        return subdomain
          ? {
              subdomain,
              owner: addressCodec.decode(
                base64Codec.encode(sub.account.data[0])
              ),
            }
          : undefined;
      })
    )
  );

  const filteredResult = result.filter((sub) => sub !== undefined);

  return filteredResult;
};
