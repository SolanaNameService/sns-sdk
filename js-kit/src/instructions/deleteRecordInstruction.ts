import { AccountRole, Address, AccountMeta, Instruction } from "@solana/kit";
import { serialize } from "borsh";

export class DeleteRecordInstruction {
  tag: number;

  static schema = {
    struct: {
      tag: "u8",
    },
  };

  constructor() {
    this.tag = 5;
  }

  serialize(): Uint8Array {
    return serialize(DeleteRecordInstruction.schema, this);
  }

  getInstruction(
    programAddress: Address,
    systemProgram: Address,
    splNameServiceProgram: Address,
    payer: Address,
    record: Address,
    domainAddress: Address,
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
        address: payer,
        role: AccountRole.WRITABLE_SIGNER,
      },
      {
        address: record,
        role: AccountRole.WRITABLE,
      },
      {
        address: domainAddress,
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
