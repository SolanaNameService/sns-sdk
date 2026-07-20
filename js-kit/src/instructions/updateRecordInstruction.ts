import {
  AccountRole,
  Address,
  AccountMeta,
  Instruction,
  ReadonlyUint8Array,
} from "@solana/kit";
import { serialize } from "borsh";

export class UpdateRecordInstruction {
  tag: number;
  record: string;
  content: ReadonlyUint8Array;

  static schema = {
    struct: {
      tag: "u8",
      record: "string",
      content: { array: { type: "u8" } },
    },
  };

  constructor(obj: { record: string; content: ReadonlyUint8Array }) {
    this.tag = 2;
    this.record = obj.record;
    this.content = obj.content;
  }

  serialize(): Uint8Array {
    return serialize(UpdateRecordInstruction.schema, this);
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
