import { Connection, PublicKey } from "@solana/web3.js";

import { getSnsDomainKeysForOwner } from "./getSnsDomainKeysForOwner";
import { reverseLookupBatch } from "./reverseLookupBatch";

export interface SnsDomain {
  domain: string;
  key: PublicKey;
}

/**
 * Retrieves directly registry-owned top-level `.sns` domains for a wallet.
 *
 * Tokenized domains and subdomains are not included.
 *
 * @param connection Solana RPC connection
 * @param wallet Wallet whose directly registry-owned domains are retrieved
 * @returns Domain records containing the domain name and its name account
 * public key
 */
export async function getSnsDomainsForOwner(
  connection: Connection,
  wallet: PublicKey,
): Promise<SnsDomain[]> {
  const keys = await getSnsDomainKeysForOwner(connection, wallet);
  const names = await reverseLookupBatch(connection, keys);

  return keys
    .map((key, index) => {
      const domain = names[index];

      return domain ? { domain, key } : undefined;
    })
    .filter((entry): entry is SnsDomain => entry !== undefined);
}
