import { AccountLayout } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";

import { getDomainMint } from "./getDomainMint";

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
