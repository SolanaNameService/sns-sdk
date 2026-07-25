import {
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
} from "@solana/web3.js";
import { NAME_TOKENIZER_ID } from "./const";
import { NftRecord } from "./state";

/**
 * Retrieves all tokenized domain name accounts.
 *
 * @param connection Solana RPC connection
 * @returns Tokenized domain name account public keys.
 *
 * @example
 * ```ts
 * const domains = await retrieveNfts(connection);
 * ```
 */
export const retrieveNfts = async (connection: Connection) => {
  const filters: GetProgramAccountsFilter[] = [
    { dataSize: NftRecord.LEN },
    {
      memcmp: {
        offset: 0,
        bytes: "3",
      },
    },
  ];

  const result = await connection.getProgramAccounts(NAME_TOKENIZER_ID, {
    filters,
  });
  const offset = 1 + 1 + 32 + 32;
  return result.map(
    (e) => new PublicKey(e.account.data.subarray(offset, offset + 32)),
  );
};
