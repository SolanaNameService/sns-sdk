import { Connection, PublicKey } from "@solana/web3.js";

import { retrieveRecords } from "../nft/retrieveRecords";
import { reverseLookupBatch } from "./reverseLookupBatch";

export interface SnsNft {
  domain: string;
  key: PublicKey;
  mint: PublicKey;
}

/**
 * Retrieves tokenized `.sns` domains owned by a wallet.
 *
 * @param connection Solana RPC connection
 * @param owner Owner of the tokenized domains
 * @returns Tokenized domain records containing the domain name, its name
 * account public key, and NFT mint public key
 */
export const getSnsNftsForOwner = async (
  connection: Connection,
  owner: PublicKey,
): Promise<SnsNft[]> => {
  const nftRecords = await retrieveRecords(connection, owner);

  const names = await reverseLookupBatch(
    connection,
    nftRecords.map((record) => record.nameAccount),
  );

  return nftRecords
    .map((record, index) => {
      const domain = names[index];

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
