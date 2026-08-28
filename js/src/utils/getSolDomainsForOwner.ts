import { base58 } from "@scure/base";
import { Connection, PublicKey } from "@solana/web3.js";

import { SOL_SRS_CLASS, SRS_PROGRAM_ID } from "../constants";
import {
  SRS_EXPIRY_LENGTH,
  SRS_OWNER_TYPE_PUBKEY,
  SRS_RECORD_CLASS_OFFSET,
  SRS_RECORD_DISCRIMINATOR,
  SRS_RECORD_EXPIRY_OFFSET,
  SRS_RECORD_METADATA_OFFSET,
  SRS_RECORD_OWNER_OFFSET,
  SRS_RECORD_OWNER_TYPE_OFFSET,
} from "../srs/constants";
import { getMetadataSerializer } from "../srs/metadata";

/**
 * A directly registry-owned top-level `.sol` domain.
 *
 * @example
 * ```ts
 * const domain: SolDomain = {
 *   domain: "example",
 *   key: nameAccount,
 * };
 * ```
 */
export interface SolDomain {
  /** TLD-trimmed `.sol` domain name. */
  domain: string;
  /** SRS record address for `domain`. */
  key: PublicKey;
}

/**
 * Retrieves directly registry-owned top-level `.sol` domains for a wallet,
 * excluding expired domains.
 *
 * Tokenized domains are also excluded.
 *
 * @param connection Solana RPC connection
 * @param wallet Wallet whose directly registry-owned domains are retrieved
 * @returns Domain records containing the domain name and its name account
 * public key
 *
 * @example
 * ```ts
 * const domains = await getSolDomainsForOwner(connection, wallet);
 * ```
 */
export async function getSolDomainsForOwner(
  connection: Connection,
  wallet: PublicKey,
): Promise<SolDomain[]> {
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
  });

  const now = BigInt(Math.floor(Date.now() / 1_000));
  const metadataSerializer = getMetadataSerializer();

  return accounts.flatMap(({ account, pubkey }) => {
    try {
      if (account.data.length < SRS_RECORD_EXPIRY_OFFSET + SRS_EXPIRY_LENGTH) {
        return [];
      }

      const expiry = account.data.readBigInt64LE(SRS_RECORD_EXPIRY_OFFSET);
      if (expiry !== BigInt(0) && expiry <= now) {
        return [];
      }

      const [metadata] = metadataSerializer.deserialize(
        account.data.subarray(SRS_RECORD_METADATA_OFFSET),
      );
      return [{ domain: metadata.name, key: pubkey }];
    } catch {
      return [];
    }
  });
}
