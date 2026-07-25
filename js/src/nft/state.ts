import { deserialize } from "borsh";
import { Connection, PublicKey } from "@solana/web3.js";
import { Buffer } from "buffer";
import { NftRecordNotFoundError } from "../error";

/** Discriminator values used by name-tokenizer accounts. */
export enum Tag {
  /** Account has not been initialized. */
  Uninitialized = 0,
  /** Account stores name-tokenizer central state. */
  CentralState = 1,
  /** Account stores an active tokenized-domain record. */
  ActiveRecord = 2,
  /** Account stores an inactive tokenized-domain record. */
  InactiveRecord = 3,
}

/**
 * Input for decoding a name-tokenizer record.
 *
 * @example
 * ```ts
 * const params: NftRecordParams = { tag: 2, nonce: 0, nameAccount, owner, nftMint };
 * ```
 */
export interface NftRecordParams {
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

/** Deserialized name-tokenizer record linking a name account to its NFT mint. */
export class NftRecord {
  /** NFT state tag. */
  tag: Tag;
  /** NFT record nonce. */
  nonce: number;
  /** SNS domain account address. */
  nameAccount: PublicKey;
  /** NFT owner address. */
  owner: PublicKey;
  /** NFT mint address. */
  nftMint: PublicKey;

  static LEN = 1 + 1 + 32 + 32 + 32;

  static schema = {
    struct: {
      tag: "u8",
      nonce: "u8",
      nameAccount: { array: { type: "u8", len: 32 } },
      owner: { array: { type: "u8", len: 32 } },
      nftMint: { array: { type: "u8", len: 32 } },
    },
  };

  constructor(obj: NftRecordParams) {
    this.tag = obj.tag as Tag;
    this.nonce = obj.nonce;
    this.nameAccount = new PublicKey(obj.nameAccount);
    this.owner = new PublicKey(obj.owner);
    this.nftMint = new PublicKey(obj.nftMint);
  }

  /** Deserializes raw name-tokenizer account data. */
  static deserialize(data: Buffer): NftRecord {
    return new NftRecord(deserialize(this.schema, data) as any);
  }

  /** Fetches and deserializes a name-tokenizer record account. */
  static async retrieve(connection: Connection, key: PublicKey) {
    const accountInfo = await connection.getAccountInfo(key);
    if (!accountInfo || !accountInfo.data) {
      throw new NftRecordNotFoundError(
        "NFT record not found: " + key.toBase58(),
      );
    }
    return this.deserialize(accountInfo.data);
  }
  /** Derives the asynchronous PDA for a name-tokenizer record. */
  static async findKey(nameAccount: PublicKey, programId: PublicKey) {
    return await PublicKey.findProgramAddress(
      [Buffer.from("nft_record"), nameAccount.toBuffer()],
      programId,
    );
  }
  /** Derives the synchronous PDA for a name-tokenizer record. */
  static findKeySync(nameAccount: PublicKey, programId: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("nft_record"), nameAccount.toBuffer()],
      programId,
    );
  }
}
