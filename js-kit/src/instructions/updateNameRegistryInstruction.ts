import { AccountMeta, AccountRole, Address, Instruction } from "@solana/kit";
import { serialize } from "borsh";

export class UpdateNameRegistryInstruction {
  tag: number;
  offset: number;
  inputData: Uint8Array;

  static schema = {
    struct: {
      tag: "u8",
      offset: "u32",
      inputData: { array: { type: "u8" } },
    },
  };

  constructor(obj: { offset: number; inputData: Uint8Array }) {
    this.tag = 1;
    this.offset = obj.offset;
    this.inputData = obj.inputData;
  }

  serialize(): Uint8Array {
    return serialize(UpdateNameRegistryInstruction.schema, this);
  }

  getInstruction(
    programAddress: Address,
    domainAddress: Address,
    signer: Address
  ): Instruction {
    const data = this.serialize();

    const accounts: AccountMeta[] = [
      {
        address: domainAddress,
        role: AccountRole.WRITABLE,
      },
      {
        address: signer,
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
