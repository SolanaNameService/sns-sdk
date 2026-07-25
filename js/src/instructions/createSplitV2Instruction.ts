import { Buffer } from "buffer";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { serialize } from "borsh";
import type { AccountKey } from "./types";

/**
 * Input for paid V2 domain registration.
 *
 * @example
 * ```ts
 * const params: CreateSplitV2InstructionParams = { name: "example", space: 1_000, referrerIdxOpt: null };
 * ```
 */
export interface CreateSplitV2InstructionParams {
  /** TLD-less domain name. */
  name: string;
  /** Account data size in bytes. */
  space: number;
  /** Approved referrer index, if any. */
  referrerIdxOpt: number | null;
}

/** Serializable V2 registrar instruction for paid domain registration. */
export class CreateSplitV2Instruction {
  /** Instruction discriminator. */
  tag: number;
  /** TLD-less domain name. */
  name: string;
  /** Account data size in bytes. */
  space: number;
  /** Approved referrer index, if any. */
  referrerIdxOpt: number | null;
  static schema = {
    struct: {
      tag: "u8",
      name: "string",
      space: "u32",
      referrerIdxOpt: { option: "u16" },
    },
  };
  constructor(obj: CreateSplitV2InstructionParams) {
    this.tag = 20;
    this.name = obj.name;
    this.space = obj.space;
    this.referrerIdxOpt = obj.referrerIdxOpt;
  }
  /** Serializes the registrar instruction payload. */
  serialize(): Uint8Array {
    return serialize(CreateSplitV2Instruction.schema, this);
  }
  /** Builds the transaction instruction with the required paid-registration accounts. */
  getInstruction(
    programId: PublicKey,
    namingServiceProgram: PublicKey,
    rootDomain: PublicKey,
    name: PublicKey,
    reverseLookup: PublicKey,
    systemProgram: PublicKey,
    centralState: PublicKey,
    buyer: PublicKey,
    domainOwner: PublicKey,
    feePayer: PublicKey,
    buyerTokenSource: PublicKey,
    pythFeedAccount: PublicKey,
    vault: PublicKey,
    splTokenProgram: PublicKey,
    rentSysvar: PublicKey,
    state: PublicKey,
    referrerAccountOpt?: PublicKey,
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
      pubkey: domainOwner,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: feePayer,
      isSigner: true,
      isWritable: true,
    });
    keys.push({
      pubkey: buyerTokenSource,
      isSigner: false,
      isWritable: true,
    });
    keys.push({
      pubkey: pythFeedAccount,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: vault,
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
    if (!!referrerAccountOpt) {
      keys.push({
        pubkey: referrerAccountOpt,
        isSigner: false,
        isWritable: true,
      });
    }
    return new TransactionInstruction({
      keys,
      programId,
      data,
    });
  }
}
