import { Buffer } from "buffer";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { serialize } from "borsh";
import type { AccountKey } from "./types";

/**
 * Input for registration with an eligible NFT.
 *
 * @example
 * ```ts
 * const params: CreateWithNftInstructionParams = { name: "example", space: 1_000 };
 * ```
 */
export interface CreateWithNftInstructionParams {
  /** TLD-less domain name. */
  name: string;
  /** Account data size in bytes. */
  space: number;
}

/** Serializable registrar instruction for registration with an eligible NFT. */
export class CreateWithNftInstruction {
  /** Instruction discriminator. */
  tag: number;
  /** TLD-less domain name. */
  name: string;
  /** Account data size in bytes. */
  space: number;
  static schema = {
    struct: {
      tag: "u8",
      name: "string",
      space: "u32",
    },
  };

  constructor(obj: CreateWithNftInstructionParams) {
    this.tag = 17;
    this.name = obj.name;
    this.space = obj.space;
  }
  /** Serializes the registrar instruction payload. */
  serialize(): Uint8Array {
    return serialize(CreateWithNftInstruction.schema, this);
  }
  /** Builds the transaction instruction with the required NFT-registration accounts. */
  getInstruction(
    programId: PublicKey,
    namingServiceProgram: PublicKey,
    rootDomain: PublicKey,
    name: PublicKey,
    reverseLookup: PublicKey,
    systemProgram: PublicKey,
    centralState: PublicKey,
    buyer: PublicKey,
    nftSource: PublicKey,
    nftMetadata: PublicKey,
    nftMint: PublicKey,
    masterEdition: PublicKey,
    collection: PublicKey,
    splTokenProgram: PublicKey,
    rentSysvar: PublicKey,
    state: PublicKey,
    mplTokenMetadata: PublicKey,
  ): TransactionInstruction {
    const data = Buffer.from(this.serialize());
    let keys: AccountKey[] = [];
    keys.push({
      pubkey: namingServiceProgram,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: rootDomain,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: name,
      isSigner: false,
      isWritable: true,
    });
    keys.push({
      pubkey: reverseLookup,
      isSigner: false,
      isWritable: true,
    });
    keys.push({
      pubkey: systemProgram,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: centralState,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: buyer,
      isSigner: true,
      isWritable: true,
    });
    keys.push({
      pubkey: nftSource,
      isSigner: false,
      isWritable: true,
    });
    keys.push({
      pubkey: nftMetadata,
      isSigner: false,
      isWritable: true,
    });
    keys.push({
      pubkey: nftMint,
      isSigner: false,
      isWritable: true,
    });
    keys.push({
      pubkey: masterEdition,
      isSigner: false,
      isWritable: true,
    });
    keys.push({
      pubkey: collection,
      isSigner: false,
      isWritable: true,
    });
    keys.push({
      pubkey: splTokenProgram,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: rentSysvar,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: state,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: mplTokenMetadata,
      isSigner: false,
      isWritable: false,
    });
    return new TransactionInstruction({
      keys,
      programId,
      data,
    });
  }
}
