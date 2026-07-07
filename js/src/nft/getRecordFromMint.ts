import {
  Connection,
  PublicKey,
  GetProgramAccountsFilter,
} from "@solana/web3.js";
import { NAME_TOKENIZER_ID } from "./const";
import { NftRecord } from "./state";

/**
 * Retrieves NFT records for a domain mint.
 *
 * @param connection Solana RPC connection
 * @param mint NFT record mint
 * @returns Matching NFT record program accounts.
 */
export const getRecordFromMint = async (
  connection: Connection,
  mint: PublicKey,
) => {
  const filters: GetProgramAccountsFilter[] = [
    { dataSize: NftRecord.LEN },
    {
      memcmp: {
        offset: 0,
        bytes: "3",
      },
    },
    {
      memcmp: {
        offset: 1 + 1 + 32 + 32,
        bytes: mint.toBase58(),
      },
    },
  ];

  const result = await connection.getProgramAccounts(NAME_TOKENIZER_ID, {
    filters,
  });

  return result;
};
