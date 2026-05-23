import { AccountRole, Address, AccountMeta, Instruction } from "@solana/kit";
import { serialize } from "borsh";

export class ReallocInstruction {
  tag: number;
  space: number;

  static schema = {
    struct: {
      tag: "u8",
      space: "u32",
    },
  };

  constructor(obj: { space: number }) {
    this.tag = 4;
    this.space = obj.space;
  }

  serialize(): Uint8Array {
    return serialize(ReallocInstruction.schema, this);
  }

  getInstruction(
    programAddress: Address,
    systemProgramId: Address,
    payerKey: Address,
    nameAccountKey: Address,
    nameOwnerKey: Address
  ): Instruction {
    const data = this.serialize();

    const accounts: AccountMeta[] = [
      {
        address: systemProgramId,
        role: AccountRole.READONLY,
      },
      {
        address: payerKey,
        role: AccountRole.WRITABLE_SIGNER,
      },
      {
        address: nameAccountKey,
        role: AccountRole.WRITABLE,
      },
      {
        address: nameOwnerKey,
        role: AccountRole.READONLY_SIGNER,
      },
    ];

    return {
      programAddress,
      accounts,
      data,
    };
  }
}
