import { PublicKey } from "@solana/web3.js";
import { MINT_PREFIX, NAME_TOKENIZER_ID } from "./const";

/**
 * Derives the NFT mint PDA for a tokenized SNS name account.
 *
 * @param domain Tokenized SNS name account address.
 * @returns The derived NFT mint address.
 *
 * @example
 * ```ts
 * const mint = getDomainMint(domainAddress);
 * ```
 */
export const getDomainMint = (domain: PublicKey) => {
  const [mint] = PublicKey.findProgramAddressSync(
    [MINT_PREFIX, domain.toBuffer()],
    NAME_TOKENIZER_ID,
  );
  return mint;
};
