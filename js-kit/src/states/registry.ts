import {
  Address,
  GetAccountInfoApi,
  GetMultipleAccountsApi,
  Rpc,
  fetchEncodedAccount,
  fetchEncodedAccounts,
} from "@solana/kit";
import { deserialize } from "borsh";

import { addressCodec } from "../codecs";
import {
  AccountDoesNotExistError,
  InvalidSerializedDataError,
} from "../errors";

/**
 * Input for decoding an SNS name-registry account.
 *
 * @example
 * ```ts
 * const params: RegistryStateParams = { parentName, owner, class: classAddress };
 * ```
 */
export interface RegistryStateParams {
  /** Encoded parent registry address. */
  parentName: Uint8Array;
  /** Encoded registry owner address. */
  owner: Uint8Array;
  /** Encoded registry class address. */
  class: Uint8Array;
}

/** Decoded state of an SNS name-registry account. */
export class RegistryState {
  /** Parent registry address. */
  parentName: Address;
  /** Registry owner address. */
  owner: Address;
  /** Registry class address. */
  class: Address;
  /** Registry data after the fixed header. */
  data: Uint8Array | undefined;

  static schema = {
    struct: {
      parentName: { array: { type: "u8", len: 32 } },
      owner: { array: { type: "u8", len: 32 } },
      class: { array: { type: "u8", len: 32 } },
    },
  };

  // The total length is calculated as the sum of:
  // - `parentName`: 32 bytes (array of `u8` with length 32)
  // - `owner`: 32 bytes (array of `u8` with length 32)
  // - `class`: 32 bytes (array of `u8` with length 32)
  static HEADER_LEN = 96;

  constructor(obj: RegistryStateParams) {
    this.parentName = addressCodec.decode(obj.parentName);
    this.owner = addressCodec.decode(obj.owner);
    this.class = addressCodec.decode(obj.class);
  }

  static deserialize(data: Uint8Array): RegistryState {
    try {
      const res = new RegistryState(deserialize(this.schema, data) as any);
      res.data = data?.slice(this.HEADER_LEN);

      return res;
    } catch {
      throw new InvalidSerializedDataError(
        "Failed to deserialize RegistryState data"
      );
    }
  }

  static async retrieve(
    rpc: Rpc<GetAccountInfoApi>,
    address: Address
  ): Promise<RegistryState> {
    const domainAccount = await fetchEncodedAccount(rpc, address);
    if (!domainAccount.exists) {
      throw new AccountDoesNotExistError("The domain account does not exist");
    }

    return this.deserialize(domainAccount.data);
  }

  static async _retrieveBatch(
    rpc: Rpc<GetMultipleAccountsApi>,
    domainAddresses: Address[]
  ): Promise<(RegistryState | undefined)[]> {
    const domainAccounts = await fetchEncodedAccounts(rpc, domainAddresses);

    return domainAccounts.map((account) =>
      account.exists ? this.deserialize(account.data) : undefined
    );
  }

  public static async retrieveBatch(
    rpc: Rpc<GetMultipleAccountsApi>,
    domainAddresses: Address[]
  ): Promise<(RegistryState | undefined)[]> {
    const result: (RegistryState | undefined)[] = [];
    const addresses = [...domainAddresses];
    while (addresses.length > 0) {
      result.push(
        ...(await this._retrieveBatch(rpc, addresses.splice(0, 100)))
      );
    }

    return result;
  }
}
