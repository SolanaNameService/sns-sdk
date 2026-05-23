import {
  AccountRole,
  Address,
  AccountMeta,
  Instruction,
  ReadonlyUint8Array,
} from "@solana/kit";
import { serialize } from "borsh";

import { addressCodec } from "../codecs";

export class writeRoaInstruction {
  tag: number;
  roaId: ReadonlyUint8Array;

  static schema = {
    struct: {
      tag: "u8",
      roaId: { array: { type: "u8" } },
    },
  };

  constructor(obj: { roaId: Address }) {
    this.tag = 6;
    this.roaId = addressCodec.encode(obj.roaId);
  }

  serialize(): Uint8Array {
    return serialize(writeRoaInstruction.schema, this);
  }

  getInstruction(
    programAddress: Address,
    systemProgram: Address,
    splNameServiceProgram: Address,
    feePayer: Address,
    record: Address,
    domain: Address,
    domainOwner: Address,
    centralState: Address
  ): Instruction {
    const data = this.serialize();

    const accounts: AccountMeta[] = [
      {
        address: systemProgram,
        role: AccountRole.READONLY,
      },
      {
        address: splNameServiceProgram,
        role: AccountRole.READONLY,
      },
      {
        address: feePayer,
        role: AccountRole.WRITABLE_SIGNER,
      },
      {
        address: record,
        role: AccountRole.WRITABLE,
      },
      {
        address: domain,
        role: AccountRole.WRITABLE,
      },
      {
        address: domainOwner,
        role: AccountRole.WRITABLE_SIGNER,
      },
      {
        address: centralState,
        role: AccountRole.READONLY,
      },
    ];

    return {
      programAddress,
      accounts,
      data,
    };
  }
}
