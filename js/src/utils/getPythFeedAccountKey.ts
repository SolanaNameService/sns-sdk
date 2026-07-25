import { Buffer } from "buffer";
import { PublicKey } from "@solana/web3.js";
import { DEFAULT_PYTH_PUSH_PROGRAM } from "../constants";

/**
 * Derives a Pyth push-oracle price-feed account address from its shard and feed ID.
 *
 * @param shard Pyth feed shard identifier
 * @param priceFeed Price-feed identifier bytes
 * @returns Derived Pyth feed address and bump seed
 *
 * @example
 * ```ts
 * const [address] = getPythFeedAccountKey(0, priceFeedId);
 * ```
 */
export const getPythFeedAccountKey = (shard: number, priceFeed: number[]) => {
  const buffer = Buffer.alloc(2);
  buffer.writeUint16LE(shard);
  return PublicKey.findProgramAddressSync(
    [buffer, Buffer.from(priceFeed)],
    DEFAULT_PYTH_PUSH_PROGRAM,
  );
};
