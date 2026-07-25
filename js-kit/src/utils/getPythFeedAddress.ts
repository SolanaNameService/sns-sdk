import { getProgramDerivedAddress } from "@solana/kit";

import { PYTH_PROGRAM_ID } from "../constants/pythFeeds";

/**
 * Parameters for deriving a Pyth feed address.
 *
 * @example
 * ```ts
 * const params: GetPythFeedAddressParams = { shard: 0, priceFeed };
 * ```
 */
export interface GetPythFeedAddressParams {
  /** Pyth feed shard number. */
  shard: number;
  /** Pyth price feed ID bytes. */
  priceFeed: number[];
}

/**
 * Derives the Pyth feed PDA for a shard and price feed.
 *
 * @param params Pyth feed derivation parameters
 * @param params.shard Shard number associated with the Pyth feed
 * @param params.priceFeed Feed ID bytes
 * @returns The Pyth feed address.
 *
 * @example
 * ```ts
 * const address = await getPythFeedAddress({ shard: 0, priceFeed });
 * ```
 */
export const getPythFeedAddress = async ({
  shard,
  priceFeed,
}: GetPythFeedAddressParams) => {
  const uint8Array = new Uint8Array(2);
  const view = new DataView(uint8Array.buffer);
  view.setUint16(0, shard, true);

  const [pda] = await getProgramDerivedAddress({
    programAddress: PYTH_PROGRAM_ID,
    seeds: [uint8Array, Uint8Array.from(priceFeed)],
  });

  return pda;
};
