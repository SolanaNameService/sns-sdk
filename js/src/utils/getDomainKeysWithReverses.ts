import { Connection, PublicKey } from "@solana/web3.js";

import { reverseLookupBatch } from "./reverseLookupBatch";
import { getSnsDomainsForOwner } from "./getSnsDomainsForOwner";

/**
 * Retrieves top-level `.sns` domain accounts owned by a wallet with reverse names.
 *
 * @param connection Solana RPC connection
 * @param wallet Wallet to search domain accounts for
 * @returns Domain account public keys and their reverse names.
 */
export async function getDomainKeysWithReverses(
  connection: Connection,
  wallet: PublicKey,
) {
  const encodedNameArr = await getSnsDomainsForOwner(connection, wallet);
  const names = await reverseLookupBatch(connection, encodedNameArr);

  return encodedNameArr.map((pubKey, index) => ({
    pubKey,
    domain: names[index],
  }));
}
