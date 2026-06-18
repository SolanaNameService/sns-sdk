import { Address, getProgramDerivedAddress } from "@solana/kit";

import { addressCodec, utf8Codec } from "../codecs";
import { NAME_TOKENIZER_ADDRESS } from "../constants/addresses";

interface GetSnsNftMintParams {
  domainAddress: Address;
}

const MINT_PREFIX = utf8Codec.encode("tokenized_name");

/**
 * Retrieves the mint address of a tokenized SNS domain.
 *
 * @param params - An object containing the following properties:
 *   - `domainAddress`: The address of the domain to derive the NFT mint from.
 * @returns A promise that resolves to the mint address of the SNS domain NFT.
 */
export const getSnsNftMint = async ({
  domainAddress,
}: GetSnsNftMintParams) => {
  const [mint] = await getProgramDerivedAddress({
    programAddress: NAME_TOKENIZER_ADDRESS,
    seeds: [MINT_PREFIX, addressCodec.encode(domainAddress)],
  });
  return mint;
};
