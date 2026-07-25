import { AccountMeta, AccountRole, Address, Instruction } from "@solana/kit";
import { serialize } from "borsh";

/**
 * Input for creating an SNS reverse-lookup account.
 *
 * @example
 * ```ts
 * const params: CreateReverseInstructionParams = { domain: "example" };
 * ```
 */
export interface CreateReverseInstructionParams {
  /** Raw reverse lookup payload. */
  domain: string;
}

/** Builder for creating an SNS reverse-lookup account. */
export class CreateReverseInstruction {
  /** Instruction discriminator. */
  tag: number;
  /** Raw reverse lookup payload. */
  domain: string;
  static schema = {
    struct: {
      tag: "u8",
      domain: "string",
    },
  };

  constructor(obj: CreateReverseInstructionParams) {
    this.tag = 12;
    this.domain = obj.domain;
  }

  serialize(): Uint8Array {
    return serialize(CreateReverseInstruction.schema, this);
  }

  getInstruction(
    programAddress: Address,
    namingServiceProgram: Address,
    rootDomain: Address,
    reverseLookup: Address,
    systemProgram: Address,
    centralState: Address,
    payer: Address,
    rentSysvar: Address,
    parentAddress?: Address,
    parentOwner?: Address
  ): Instruction {
    const data = this.serialize();

    const accounts: AccountMeta[] = [
      {
        address: namingServiceProgram,
        role: AccountRole.READONLY,
      },
      {
        address: rootDomain,
        role: AccountRole.READONLY,
      },
      {
        address: reverseLookup,
        role: AccountRole.WRITABLE,
      },
      {
        address: systemProgram,
        role: AccountRole.READONLY,
      },
      {
        address: centralState,
        role: AccountRole.READONLY,
      },
      {
        address: payer,
        role: AccountRole.WRITABLE_SIGNER,
      },
      {
        address: rentSysvar,
        role: AccountRole.READONLY,
      },
    ];

    if (parentAddress) {
      accounts.push({
        address: parentAddress,
        role: AccountRole.WRITABLE,
      });
    }

    if (parentOwner) {
      accounts.push({
        address: parentOwner,
        role: AccountRole.WRITABLE_SIGNER,
      });
    }

    return {
      programAddress,
      accounts,
      data,
    };
  }
}
