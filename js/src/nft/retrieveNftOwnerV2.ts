import { AccountLayout } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";

import { getDomainMint } from "./getDomainMint";

/**
 * Retrieves the owner of a tokenized name using the mint's largest token account.
 *
 * Returns `null` when the mint or a one-token holder cannot be found.
 *
 * @param connection Solana RPC connection used to query token accounts.
 * @param nameAccount Tokenized SNS name account address.
 * @returns The owner public key, or `null` when no one-token holder exists.
 *
 * @example
 * ```ts
 * const owner = await retrieveNftOwnerV2(connection, nameAccount);
 * ```
 */
export const retrieveNftOwnerV2 = async (
  connection: Connection,
  nameAccount: PublicKey,
) => {
  try {
    const mint = getDomainMint(nameAccount);

    const largestAccounts = await connection.getTokenLargestAccounts(mint);
    if (largestAccounts.value.length === 0) {
      return null;
    }

    const largestAccountInfo = await connection.getAccountInfo(
      largestAccounts.value[0].address,
    );

    if (!largestAccountInfo) {
      return null;
    }

    const decoded = AccountLayout.decode(largestAccountInfo.data);
    if (decoded.amount.toString() === "1") {
      return decoded.owner;
    }
    return null;
  } catch (err) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      err.code === -32602
    ) {
      // Mint does not exist
      return null;
    }

    throw err;
  }
};
