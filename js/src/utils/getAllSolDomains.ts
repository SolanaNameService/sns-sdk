import { base58 } from "@scure/base";
import { Connection } from "@solana/web3.js";
import { SOL_SRS_CLASS, SRS_PROGRAM_ID } from "../constants";
import {
  SRS_ADDRESS_LENGTH,
  SRS_RECORD_DISCRIMINATOR,
  SRS_RECORD_OWNER_OFFSET,
} from "../srs/constants";

/**
 * Retrieves all registered top-level `.sol` domain accounts, including expired
 * domains.
 *
 * @param connection Solana RPC connection
 * @returns Registered domain accounts, including expired records, with account
 * data containing only the owner public key.
 *
 * @example
 * ```ts
 * const domains = await getAllSolDomains(connection);
 * ```
 */
export const getAllSolDomains = async (connection: Connection) => {
  const filters = [
    {
      memcmp: {
        offset: 0,
        bytes: base58.encode(Uint8Array.of(SRS_RECORD_DISCRIMINATOR)),
      },
    },
    {
      memcmp: {
        offset: 1,
        bytes: SOL_SRS_CLASS.toBase58(),
      },
    },
  ];
  const dataSlice = {
    offset: SRS_RECORD_OWNER_OFFSET,
    length: SRS_ADDRESS_LENGTH,
  };

  const accounts = await connection.getProgramAccounts(SRS_PROGRAM_ID, {
    dataSlice,
    filters,
  });
  return accounts;
};
