import { Buffer } from "buffer";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { serialize } from "borsh";
import type { AccountKey } from "./types";

/** Serializable registrar instruction for setting a wallet primary domain. */
export class SetPrimaryInstruction {
  /** Instruction discriminator. */
  tag: number;
  static schema = {
    struct: {
      tag: "u8",
    },
  };
  constructor() {
    this.tag = 6;
  }
  /** Serializes the registrar instruction payload. */
  serialize(): Uint8Array {
    return serialize(SetPrimaryInstruction.schema, this);
  }
  /** Builds the transaction instruction with the required primary-domain accounts. */
  getInstruction(
    programId: PublicKey,
    nameAccount: PublicKey,
    primaryAccount: PublicKey,
    owner: PublicKey,
    systemProgram: PublicKey,
    optParent?: PublicKey,
  ): TransactionInstruction {
    const data = Buffer.from(this.serialize());
    let keys: AccountKey[] = [];
    keys.push({
      pubkey: nameAccount,
      isSigner: false,
      isWritable: false,
    });
    keys.push({
      pubkey: primaryAccount,
      isSigner: false,
      isWritable: true,
    });
    keys.push({
      pubkey: owner,
      isSigner: true,
      isWritable: true,
    });
    keys.push({
      pubkey: systemProgram,
      isSigner: false,
      isWritable: false,
    });
    if (!!optParent) {
      keys.push({
        pubkey: optParent,
        isSigner: false,
        isWritable: false,
      });
    }
    return new TransactionInstruction({
      keys,
      programId,
      data,
    });
  }
}
