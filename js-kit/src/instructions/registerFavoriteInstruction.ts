import { AccountRole, Address, AccountMeta, Instruction } from "@solana/kit";
import { serialize } from "borsh";

export class RegisterFavoriteInstruction {
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
    return serialize(RegisterFavoriteInstruction.schema, this);
  }

  getInstruction(
    programAddress: Address,
    nameAccount: Address,
    favouriteAccount: Address,
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
        address: favouriteAccount,
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
