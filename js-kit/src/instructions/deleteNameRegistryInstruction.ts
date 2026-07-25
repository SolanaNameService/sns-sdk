import { AccountMeta, AccountRole, Address, Instruction } from "@solana/kit";
import { serialize } from "borsh";

/** Builder for deleting an SNS name-registry account. */
export class DeleteNameRegistryInstruction {
  /** Instruction discriminator. */
  tag: number;

  static schema = {
    struct: {
      tag: "u8",
    },
  };

  constructor() {
    this.tag = 3;
  }

  serialize(): Uint8Array {
    return serialize(DeleteNameRegistryInstruction.schema, this);
  }

  getInstruction(
    programAddress: Address,
    domainAddress: Address,
    refundTarget: Address,
    owner: Address
  ): Instruction {
    const data = this.serialize();

    const accounts: AccountMeta[] = [
      {
        address: domainAddress,
        role: AccountRole.WRITABLE,
      },
      {
        address: owner,
        role: AccountRole.READONLY_SIGNER,
      },
      {
        address: refundTarget,
        role: AccountRole.WRITABLE,
      },
    ];

    return {
      programAddress,
      accounts,
      data,
    };
  }
}
