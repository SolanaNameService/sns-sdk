import { Connection, PublicKey } from "@solana/web3.js";
import { retrieveRecords } from "../nft/retrieveRecords";
import { reverseLookupBatch } from "./reverseLookupBatch";

/**
 * Retrieves tokenized `.sns` domains owned by an owner.
 *
 * @param connection Solana RPC connection
 * @param owner Owner of the tokenized domains
 * @returns Tokenized domain records with name account, mint, and reverse name.
 */
export const getSnsNftsForOwner = async (
  connection: Connection,
  owner: PublicKey,
) => {
  const nftRecords = await retrieveRecords(connection, owner);

  const names = await reverseLookupBatch(
    connection,
    nftRecords.map((e) => e.nameAccount),
  );

  return names
    .map((e, idx) => {
      return {
        key: nftRecords[idx].nameAccount,
        mint: nftRecords[idx].nftMint,
        reverse: e,
      };
    })
    .filter((e) => !!e.reverse);
};
