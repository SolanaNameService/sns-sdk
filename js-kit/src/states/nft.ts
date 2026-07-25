import {
  Address,
  Base58EncodedBytes,
  GetAccountInfoApi,
  GetProgramAccountsApi,
  Rpc,
  fetchEncodedAccount,
  getProgramDerivedAddress,
} from "@solana/kit";
import { deserialize } from "borsh";

import { addressCodec, base64Codec, utf8Codec } from "../codecs";
import { NAME_TOKENIZER_ADDRESS } from "../constants/addresses";
import { InvalidSerializedDataError, NftAccountNotFoundError } from "../errors";

/** Tags identifying the SNS NFT state variant. */
export enum NftTag {
  Uninitialized = 0,
  CentralState = 1,
  ActiveRecord = 2,
  InactiveRecord = 3,
}

/**
 * Input for decoding an SNS NFT account.
 *
 * @example
 * ```ts
 * const params: NftStateParams = { tag: 2, nonce: 0, nameAccount, owner, nftMint };
 * ```
 */
export interface NftStateParams {
  /** NFT state tag. */
  tag: number;
  /** NFT record nonce. */
  nonce: number;
  /** Encoded SNS domain account address. */
  nameAccount: Uint8Array;
  /** Encoded NFT owner address. */
  owner: Uint8Array;
  /** Encoded NFT mint address. */
  nftMint: Uint8Array;
}

/** Decoded state of an SNS NFT account. */
export class NftState {
  /** NFT state tag. */
  tag: NftTag;
  /** NFT record nonce. */
  nonce: number;
  /** SNS domain account address. */
  nameAccount: Address;
  /** NFT owner address. */
  owner: Address;
  /** NFT mint address. */
  nftMint: Address;

  static schema = {
    struct: {
      tag: "u8",
      nonce: "u8",
      nameAccount: { array: { type: "u8", len: 32 } },
      owner: { array: { type: "u8", len: 32 } },
      nftMint: { array: { type: "u8", len: 32 } },
    },
  };

  // The total length of the struct is calculated as the sum of:
  // - `tag`: 1 byte (`u8`)
  // - `nonce`: 1 byte (`u8`)
  // - `nameAccount`: 32 bytes (array of `u8` with length 32)
  // - `owner`: 32 bytes (array of `u8` with length 32)
  // - `nftMint`: 32 bytes (array of `u8` with length 32)
  static LEN = 1 + 1 + 32 + 32 + 32;

  constructor(obj: NftStateParams) {
    this.tag = obj.tag as NftTag;
    this.nonce = obj.nonce;
    this.nameAccount = addressCodec.decode(obj.nameAccount);
    this.owner = addressCodec.decode(obj.owner);
    this.nftMint = addressCodec.decode(obj.nftMint);
  }

  static deserialize(data: Uint8Array): NftState {
    try {
      return new NftState(deserialize(this.schema, data) as any);
    } catch {
      throw new InvalidSerializedDataError(
        "Failed to deserialize NftState data"
      );
    }
  }

  static async retrieve(
    rpc: Rpc<GetAccountInfoApi>,
    address: Address
  ): Promise<NftState> {
    const nftAccount = await fetchEncodedAccount(rpc, address);
    if (!nftAccount.exists) {
      throw new NftAccountNotFoundError(`NFT not found: ${address}`);
    }
    return this.deserialize(nftAccount.data);
  }

  static async retrieveFromMint(
    rpc: Rpc<GetProgramAccountsApi>,
    mint: Address
  ): Promise<NftState> {
    const data = await rpc
      .getProgramAccounts(NAME_TOKENIZER_ADDRESS, {
        encoding: "base64",
        filters: [
          { dataSize: BigInt(NftState.LEN) },
          {
            memcmp: {
              offset: BigInt(0),
              bytes: "3" as Base58EncodedBytes,
              encoding: "base58",
            },
          },
          {
            memcmp: {
              offset: BigInt(1 + 1 + 32 + 32),
              bytes: mint as string as Base58EncodedBytes,
              encoding: "base58",
            },
          },
        ],
      })
      .send();

    if (data.length !== 1) {
      throw new NftAccountNotFoundError(`NFT not found: ${mint}`);
    }

    return this.deserialize(
      base64Codec.encode(data[0].account.data[0]) as Uint8Array
    );
  }

  static async getAddress(domainAddress: Address): Promise<Address> {
    const [address] = await getProgramDerivedAddress({
      programAddress: NAME_TOKENIZER_ADDRESS,
      seeds: [
        utf8Codec.encode("nft_record"),
        addressCodec.encode(domainAddress),
      ],
    });

    return address;
  }
}
