import { Connection, PublicKey } from "@solana/web3.js";
import { retrieveNftOwnerV2 } from "./nft/retrieveNftOwnerV2";
import { Buffer } from "buffer";
import { deserialize } from "borsh";
import { AccountDoesNotExistError } from "./error";

/**
 * Input for decoding an SNS name registry account.
 *
 * @example
 * ```ts
 * const params: NameRegistryStateParams = { parentName, owner, class: classAddress };
 * ```
 */
export interface NameRegistryStateParams {
  /** Encoded parent registry address. */
  parentName: Uint8Array;
  /** Encoded registry owner address. */
  owner: Uint8Array;
  /** Encoded registry class address. */
  class: Uint8Array;
}

/** Deserialized header and payload of an SNS name registry account. */
export class NameRegistryState {
  /** Fixed byte length of the registry header. */
  static HEADER_LEN = 96;
  /** Parent registry address. */
  parentName: PublicKey;
  /** Registry owner address. */
  owner: PublicKey;
  /** Registry class address. */
  class: PublicKey;
  /** Registry data after the fixed header. */
  data: Buffer | undefined;

  static schema = {
    struct: {
      parentName: { array: { type: "u8", len: 32 } },
      owner: { array: { type: "u8", len: 32 } },
      class: { array: { type: "u8", len: 32 } },
    },
  };

  constructor(obj: NameRegistryStateParams) {
    this.parentName = new PublicKey(obj.parentName);
    this.owner = new PublicKey(obj.owner);
    this.class = new PublicKey(obj.class);
  }

  /** Deserializes raw name registry account data. */
  static deserialize(data: Buffer) {
    const res = new NameRegistryState(deserialize(this.schema, data) as any);

    res.data = data?.subarray(this.HEADER_LEN);
    return res;
  }

  /** Fetches a name registry account and its tokenized-domain owner, if any. */
  public static async retrieve(
    connection: Connection,
    nameAccountKey: PublicKey,
  ) {
    const nameAccount = await connection.getAccountInfo(nameAccountKey);
    if (!nameAccount) {
      throw new AccountDoesNotExistError(`The name account does not exist`);
    }

    const res = new NameRegistryState(
      deserialize(this.schema, nameAccount.data) as any,
    );
    res.data = nameAccount.data?.subarray(this.HEADER_LEN);

    const nftOwner = await retrieveNftOwnerV2(connection, nameAccountKey);

    return { registry: res, nftOwner };
  }

  /** Fetches one RPC-sized batch of name registry accounts. */
  static async _retrieveBatch(
    connection: Connection,
    nameAccountKeys: PublicKey[],
  ) {
    const nameAccounts =
      await connection.getMultipleAccountsInfo(nameAccountKeys);
    const fn = (data: Buffer | undefined) => {
      if (!data) return undefined;
      const res = new NameRegistryState(deserialize(this.schema, data) as any);
      res.data = data?.subarray(this.HEADER_LEN);
      return res;
    };
    return nameAccounts.map((e) => fn(e?.data));
  }

  /** Fetches and deserializes name registry accounts in batches of up to 100. */
  public static async retrieveBatch(
    connection: Connection,
    nameAccountKeys: PublicKey[],
  ) {
    let result: (NameRegistryState | undefined)[] = [];
    const keys = [...nameAccountKeys];
    while (keys.length > 0) {
      result.push(
        ...(await this._retrieveBatch(connection, keys.splice(0, 100))),
      );
    }
    return result;
  }
}
