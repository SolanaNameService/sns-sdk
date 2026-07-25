import { Connection, PublicKey } from "@solana/web3.js";
import { NAME_PROGRAM_ID, SNS_ROOT_DOMAIN_ACCOUNT } from "../constants";

/**
 * Retrieves top-level `.sns` domain accounts owned by a wallet.
 *
 * @param connection Solana RPC connection
 * @param wallet Wallet to search domain accounts for
 * @returns Domain account public keys.
 *
 * @example
 * ```ts
 * const keys = await getSnsDomainKeysForOwner(connection, wallet);
 * ```
 */
export async function getSnsDomainKeysForOwner(
  connection: Connection,
  wallet: PublicKey,
): Promise<PublicKey[]> {
  const filters = [
    {
      memcmp: {
        offset: 32,
        bytes: wallet.toBase58(),
      },
    },
    {
      memcmp: {
        offset: 0,
        bytes: SNS_ROOT_DOMAIN_ACCOUNT.toBase58(),
      },
    },
  ];
  const accounts = await connection.getProgramAccounts(NAME_PROGRAM_ID, {
    filters,
    // Only the public keys matter, not the data
    dataSlice: { offset: 0, length: 0 },
  });
  return accounts.map((a) => a.pubkey);
}
