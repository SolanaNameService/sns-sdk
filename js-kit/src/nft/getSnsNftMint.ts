import { Address, getProgramDerivedAddress } from "@solana/kit";

import { addressCodec, utf8Codec } from "../codecs";
import { NAME_TOKENIZER_ADDRESS } from "../constants/addresses";

/**
 * Parameters for deriving an SNS NFT mint.
 *
 * @example
 * ```ts
 * const params: GetSnsNftMintParams = { domainAddress };
 * ```
 */
export interface GetSnsNftMintParams {
  /** Tokenized domain account address. */
  domainAddress: Address;
}

const MINT_PREFIX = utf8Codec.encode("tokenized_name");

/**
 * Derives the mint address of a tokenized SNS domain.
 *
 * @param params NFT mint derivation parameters
 * @param params.domainAddress Domain account address used to derive the NFT mint
 * @returns The derived SNS domain NFT mint address.
 *
 * @example
 * ```ts
 * const mint = await getSnsNftMint({ domainAddress });
 * ```
 */
export const getSnsNftMint = async ({ domainAddress }: GetSnsNftMintParams) => {
  const [mint] = await getProgramDerivedAddress({
    programAddress: NAME_TOKENIZER_ADDRESS,
    seeds: [MINT_PREFIX, addressCodec.encode(domainAddress)],
  });
  return mint;
};
