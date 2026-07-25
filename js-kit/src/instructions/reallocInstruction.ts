import { AccountMeta, AccountRole, Address, Instruction } from "@solana/kit";
import { serialize } from "borsh";

/**
 * Input for reallocating an SNS name-registry account.
 *
 * @example
 * ```ts
 * const params: ReallocInstructionParams = { space: 1_000 };
 * ```
 */
export interface ReallocInstructionParams {
  /** New account data size in bytes. */
  space: number;
}

/** Builder for reallocating an SNS name-registry account. */
export class ReallocInstruction {
  /** Instruction discriminator. */
  tag: number;
  /** New account data size in bytes. */
  space: number;

  static schema = {
    struct: {
      tag: "u8",
      space: "u32",
    },
  };

  constructor(obj: ReallocInstructionParams) {
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
