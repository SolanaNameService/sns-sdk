import { base58 } from "@scure/base";
import { Connection, PublicKey } from "@solana/web3.js";

import { SOL_SRS_CLASS, SRS_PROGRAM_ID } from "../constants";
import {
  SRS_EXPIRY_LENGTH,
  SRS_OWNER_TYPE_PUBKEY,
  SRS_RECORD_CLASS_OFFSET,
  SRS_RECORD_DISCRIMINATOR,
  SRS_RECORD_EXPIRY_OFFSET,
  SRS_RECORD_OWNER_OFFSET,
  SRS_RECORD_OWNER_TYPE_OFFSET,
} from "../srs/constants";

/**
 * Retrieves top-level `.sol` domain accounts owned by a wallet, excluding
 * expired domains.
 *
 * @param connection Solana RPC connection
 * @param wallet Wallet to search domain accounts for
 * @returns Public keys for non-expired domain accounts.
 *
 * @example
 * ```ts
 * const keys = await getSolDomainKeysForOwner(connection, wallet);
 * ```
 */
export async function getSolDomainKeysForOwner(
  connection: Connection,
  wallet: PublicKey,
): Promise<PublicKey[]> {
  const filters = [
    {
      memcmp: {
        offset: 0,
        bytes: base58.encode(Uint8Array.of(SRS_RECORD_DISCRIMINATOR)),
      },
    },
    {
      memcmp: {
        offset: SRS_RECORD_CLASS_OFFSET,
        bytes: SOL_SRS_CLASS.toBase58(),
      },
    },
    {
      memcmp: {
        offset: SRS_RECORD_OWNER_TYPE_OFFSET,
        bytes: base58.encode(Uint8Array.of(SRS_OWNER_TYPE_PUBKEY)),
      },
    },
    {
      memcmp: {
        offset: SRS_RECORD_OWNER_OFFSET,
        bytes: wallet.toBase58(),
      },
    },
  ];
  const accounts = await connection.getProgramAccounts(SRS_PROGRAM_ID, {
    filters,
    dataSlice: {
      offset: SRS_RECORD_EXPIRY_OFFSET,
      length: SRS_EXPIRY_LENGTH,
    },
  });
  const now = BigInt(Math.floor(Date.now() / 1_000));

  return accounts.flatMap(({ account, pubkey }) => {
    try {
      const expiry = account.data.readBigInt64LE(0);
      return expiry === BigInt(0) || expiry > now ? [pubkey] : [];
    } catch {
      return [];
    }
  });
}
