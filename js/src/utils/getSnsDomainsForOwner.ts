import { Connection, PublicKey } from "@solana/web3.js";

import { getSnsDomainKeysForOwner } from "./getSnsDomainKeysForOwner";
import { reverseLookupBatch } from "./reverseLookupBatch";

/**
 * A directly registry-owned top-level SNS domain.
 *
 * @example
 * ```ts
 * const firstDomain: SnsDomain | undefined = domains[0];
 * ```
 */
export interface SnsDomain {
  /** Fully qualified `.sns` domain name. */
  domain: string;

  /** Name-service account address for `domain`. */
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
 *
 * @example
 * ```ts
 * const domains = await getSnsDomainsForOwner(connection, wallet);
 * ```
 */
export async function getSnsDomainsForOwner(
  connection: Connection,
  wallet: PublicKey,
): Promise<SnsDomain[]> {
  const keys = await getSnsDomainKeysForOwner(connection, wallet);
  const domains = await reverseLookupBatch(connection, keys);

  return keys
    .map((key, index) => {
      const domain = domains[index];

      return domain ? { domain, key } : undefined;
    })
    .filter((entry): entry is SnsDomain => entry !== undefined);
}
