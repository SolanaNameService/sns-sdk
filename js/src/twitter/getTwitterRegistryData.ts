import { Buffer } from "buffer";
import { Connection, PublicKey } from "@solana/web3.js";
import {
  NAME_PROGRAM_ID,
  TWITTER_ROOT_PARENT_REGISTRY_KEY,
} from "../constants";
import { NameRegistryState } from "../state";
import { MultipleRegistriesError } from "../error";

/**
 * Retrieves raw user-facing registry data for a verified Twitter public key.
 *
 * This uses an RPC program-account query and does not return the handle; RPC
 * filtering performance varies by provider.
 *
 * @param connection Solana RPC connection
 * @param verifiedPubkey Verified public key associated with the handle
 * @returns Raw name-registry payload bytes
 * @throws {MultipleRegistriesError} When more than one registry matches
 *
 * @example
 * ```ts
 * const data = await getTwitterRegistryData(connection, verifiedPubkey);
 * ```
 */
export async function getTwitterRegistryData(
  connection: Connection,
  verifiedPubkey: PublicKey,
): Promise<Buffer> {
  const filters = [
    {
      memcmp: {
        offset: 0,
        bytes: TWITTER_ROOT_PARENT_REGISTRY_KEY.toBase58(),
      },
    },
    {
      memcmp: {
        offset: 32,
        bytes: verifiedPubkey.toBase58(),
      },
    },
    {
      memcmp: {
        offset: 64,
        bytes: new PublicKey(Buffer.alloc(32, 0)).toBase58(),
      },
    },
  ];

  const filteredAccounts = await connection.getProgramAccounts(
    NAME_PROGRAM_ID,
    { filters },
  );

  if (filteredAccounts.length > 1) {
    throw new MultipleRegistriesError("More than 1 accounts were found");
  }

  return filteredAccounts[0].account.data.subarray(
    NameRegistryState.HEADER_LEN,
  );
}
