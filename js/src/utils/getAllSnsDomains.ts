import { Connection } from "@solana/web3.js";
import { NAME_PROGRAM_ID, SNS_ROOT_DOMAIN_ACCOUNT } from "../constants";

/**
 * Retrieves all registered top-level `.sns` domain accounts.
 *
 * The account data is sliced to avoid enormous payloads and only the owner is returned.
 *
 * @param connection Solana RPC connection
 * @returns Registered domain accounts with sliced account data.
 *
 * @example
 * ```ts
 * const domains = await getAllSnsDomains(connection);
 * ```
 */
export const getAllSnsDomains = async (connection: Connection) => {
  const filters = [
    {
      memcmp: {
        offset: 0,
        bytes: SNS_ROOT_DOMAIN_ACCOUNT.toBase58(),
      },
    },
  ];
  const dataSlice = { offset: 32, length: 32 };

  const accounts = await connection.getProgramAccounts(NAME_PROGRAM_ID, {
    dataSlice,
    filters,
  });
  return accounts;
};
