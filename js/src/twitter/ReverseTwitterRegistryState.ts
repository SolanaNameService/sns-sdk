import { deserialize } from "borsh";
import { Connection, PublicKey } from "@solana/web3.js";
import { NameRegistryState } from "../state";
import { InvalidReverseTwitterError } from "../error";

/**
 * Input for decoding a reverse Twitter registry.
 *
 * @example
 * ```ts
 * const params: ReverseTwitterRegistryStateParams = { twitterRegistryKey, twitterHandle: "bonfida" };
 * ```
 */
export interface ReverseTwitterRegistryStateParams {
  /** Encoded verified Twitter registry address. */
  twitterRegistryKey: Uint8Array;
  /** Verified Twitter handle. */
  twitterHandle: string;
}

/** Deserialized reverse registry linking a verified key to a Twitter handle. */
export class ReverseTwitterRegistryState {
  /** Encoded verified Twitter registry address. */
  twitterRegistryKey: Uint8Array;
  /** Verified Twitter handle. */
  twitterHandle: string;

  static schema = {
    struct: {
      twitterRegistryKey: { array: { type: "u8", len: 32 } },
      twitterHandle: "string",
    },
  };

  constructor(obj: ReverseTwitterRegistryStateParams) {
    this.twitterRegistryKey = obj.twitterRegistryKey;
    this.twitterHandle = obj.twitterHandle;
  }

  /** Fetches and deserializes a reverse Twitter registry account. */
  public static async retrieve(
    connection: Connection,
    reverseTwitterAccountKey: PublicKey,
  ): Promise<ReverseTwitterRegistryState> {
    let reverseTwitterAccount = await connection.getAccountInfo(
      reverseTwitterAccountKey,
      "processed",
    );
    if (!reverseTwitterAccount) {
      throw new InvalidReverseTwitterError(
        "The reverse twitter account was not found",
      );
    }

    const res = new ReverseTwitterRegistryState(
      deserialize(
        ReverseTwitterRegistryState.schema,
        reverseTwitterAccount.data.subarray(NameRegistryState.HEADER_LEN),
      ) as any,
    );

    return res;
  }
}
