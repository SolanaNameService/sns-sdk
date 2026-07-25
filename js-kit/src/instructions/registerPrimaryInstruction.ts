import { AccountMeta, AccountRole, Address, Instruction } from "@solana/kit";
import { serialize } from "borsh";

/** Builder for registering an address's SNS primary domain. */
export class RegisterPrimaryInstruction {
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

  serialize(): Uint8Array {
    return serialize(RegisterPrimaryInstruction.schema, this);
  }

  getInstruction(
    programAddress: Address,
    nameAccount: Address,
    primaryAccount: Address,
    owner: Address,
    systemProgram: Address,
    optParent?: Address
  ): Instruction {
    const data = this.serialize();
    const accounts: AccountMeta[] = [
      {
        address: nameAccount,
        role: AccountRole.READONLY,
      },
      {
        address: primaryAccount,
        role: AccountRole.WRITABLE,
      },
      {
        address: owner,
        role: AccountRole.WRITABLE_SIGNER,
      },
      {
        address: systemProgram,
        role: AccountRole.READONLY,
      },
    ];

    if (optParent) {
      accounts.push({
        address: optParent,
        role: AccountRole.READONLY,
      });
    }

    return {
      programAddress,
      accounts,
      data,
    };
  }
}
