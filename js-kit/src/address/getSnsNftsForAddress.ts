import {
  Address,
  Base58EncodedBytes,
  GetMultipleAccountsApi,
  GetProgramAccountsApi,
  Rpc,
} from "@solana/kit";

import { base64Codec, tokenCodec } from "../codecs";
import { TOKEN_PROGRAM_ADDRESS } from "../constants/addresses";
import { NftState } from "../states/nft";
import { reverseLookupBatch } from "../utils/reverseLookupBatch";

/**
 * Parameters for retrieving SNS domain NFTs owned by an address.
 *
 * @example
 * ```ts
 * const params: GetSnsNftsForAddressParams = { rpc, address };
 * ```
 */
export interface GetSnsNftsForAddressParams {
  /** RPC client. */
  rpc: Rpc<GetMultipleAccountsApi & GetProgramAccountsApi>;
  /** Owner address. */
  address: Address;
}

/**
 * An SNS domain NFT owned by an address.
 *
 * @example
 * ```ts
 * const domain: GetSnsNftsForAddressResult = {
 *   domain: "example",
 *   domainAddress,
 *   mint,
 * };
 * ```
 */
export interface GetSnsNftsForAddressResult {
  /** TLD-less domain name. */
  domain: string;
  /** Domain account address. */
  domainAddress: Address;
  /** NFT mint address. */
  mint: Address;
}

/**
 * Retrieves tokenized SNS domain NFT states for an address.
 *
 * Failed NFT state lookups are skipped. If token account retrieval fails, an
 * empty array is returned.
 *
 * @param params NFT state retrieval parameters
 * @param params.rpc RPC client implementing program account lookup
 * @param params.address Address whose tokenized domain NFT states are retrieved
 * @returns Successfully decoded NFT states.
 */
const getNftStatesForAddress = async ({
  rpc,
  address,
}: {
  rpc: Rpc<GetProgramAccountsApi>;
  address: Address;
}): Promise<NftState[]> => {
  try {
    const results = await rpc
      .getProgramAccounts(TOKEN_PROGRAM_ADDRESS, {
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
              offset: 64n,
              bytes: "2" as Base58EncodedBytes,
              encoding: "base58",
            },
          },
          { dataSize: 165n },
        ],
      })
      .send();

    const nftStates = await Promise.all(
      results.map(({ account }) => {
        const { mint } = tokenCodec.decode(base64Codec.encode(account.data[0]));
        return NftState.retrieveFromMint(rpc, mint).catch(() => undefined);
      })
    );

    return nftStates.filter((state) => state !== undefined);
  } catch (error) {
    console.error("Error retrieving NFT records:", error);
    return [];
  }
};

/**
 * Retrieves the SNS domain NFTs owned by a given address.
 *
 * Returned `domain` values do not include a `.sns` or `.sol` suffix.
 * If NFT records cannot be retrieved or decoded, this function returns an empty
 * array instead of throwing.
 *
 * Entries without reverse lookup results are omitted.
 *
 * @param params Tokenized domain retrieval parameters
 * @param params.rpc RPC client implementing multiple-account and program account APIs
 * @param params.address Address whose SNS domain NFTs are retrieved
 * @returns Tokenized domain records with names without a TLD suffix, domain addresses, and mints.
 *
 * @example
 * ```ts
 * const domains = await getSnsNftsForAddress({ rpc, address });
 * ```
 */
export const getSnsNftsForAddress = async ({
  rpc,
  address,
}: GetSnsNftsForAddressParams): Promise<GetSnsNftsForAddressResult[]> => {
  const nftStates = await getNftStatesForAddress({ rpc, address });
  const nftNameAccounts = nftStates.map((state) => state.nameAccount);
  const domains = await reverseLookupBatch({
    rpc,
    domainAddresses: nftNameAccounts,
  });

  return domains
    .map((domain, idx) =>
      domain
        ? {
            domain,
            domainAddress: nftStates[idx].nameAccount,
            mint: nftStates[idx].nftMint,
          }
        : undefined
    )
    .filter((e) => e !== undefined);
};
