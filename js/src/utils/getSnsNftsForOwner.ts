import { Connection, PublicKey } from "@solana/web3.js";

import { retrieveRecords } from "../nft/retrieveRecords";
import { reverseLookupBatch } from "./reverseLookupBatch";

/**
 * A tokenized SNS domain and its associated NFT mint.
 *
 * @example
 * ```ts
 * const firstDomain: SnsNft | undefined = domains[0];
 * ```
 */
export interface SnsNft {
  /** Fully qualified `.sns` domain name. */
  domain: string;

  /** Name-service account address for `domain`. */
  key: PublicKey;

  /** NFT mint that tokenizes `domain`. */
  mint: PublicKey;
}

/**
 * Retrieves tokenized `.sns` domains owned by a wallet.
 *
 * @param connection Solana RPC connection
 * @param owner Owner of the tokenized domains
 * @returns Tokenized domain records containing the domain name, its name
 * account public key, and NFT mint public key
 *
 * @example
 * ```ts
 * const domains = await getSnsNftsForOwner(connection, wallet);
 * ```
 */
export const getSnsNftsForOwner = async (
  connection: Connection,
  owner: PublicKey,
): Promise<SnsNft[]> => {
  const nftRecords = await retrieveRecords(connection, owner);

  const domains = await reverseLookupBatch(
    connection,
    nftRecords.map((record) => record.nameAccount),
  );

  return nftRecords
    .map((record, index) => {
      const domain = domains[index];

      return domain
        ? {
            domain,
            key: record.nameAccount,
            mint: record.nftMint,
          }
        : undefined;
    })
    .filter((entry): entry is SnsNft => entry !== undefined);
};
