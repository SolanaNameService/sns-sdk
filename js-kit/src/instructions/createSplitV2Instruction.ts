import { AccountMeta, AccountRole, Address, Instruction } from "@solana/kit";
import { serialize } from "borsh";

/**
 * Input for creating a split SNS V2 domain account.
 *
 * @example
 * ```ts
 * const params: CreateSplitV2InstructionParams = { name: "example", space: 1_000, referrerIdxOpt: null };
 * ```
 */
export interface CreateSplitV2InstructionParams {
  /** TLD-less domain name. */
  name: string;
  /** Account data size in bytes. */
  space: number;
  /** Approved referrer index, if any. */
  referrerIdxOpt: number | null;
}

/** Builder for creating a split SNS V2 domain account. */
export class CreateSplitV2Instruction {
  /** Instruction discriminator. */
  tag: number;
  /** TLD-less domain name. */
  name: string;
  /** Account data size in bytes. */
  space: number;
  /** Approved referrer index, if any. */
  referrerIdxOpt: number | null;

  static schema = {
    struct: {
      tag: "u8",
      name: "string",
      space: "u32",
      referrerIdxOpt: { option: "u16" },
    },
  };

  constructor(obj: CreateSplitV2InstructionParams) {
    this.tag = 20;
    this.name = obj.name;
    this.space = obj.space;
    this.referrerIdxOpt = obj.referrerIdxOpt;
  }

  serialize(): Uint8Array {
    return serialize(CreateSplitV2Instruction.schema, this);
  }

  getInstruction(
    programAddress: Address,
    namingServiceProgram: Address,
    rootDomain: Address,
    name: Address,
    reverseLookup: Address,
    systemProgram: Address,
    centralState: Address,
    buyer: Address,
    domainOwner: Address,
    feePayer: Address,
    buyerTokenSource: Address,
    pythFeedAccount: Address,
    vault: Address,
    splTokenProgram: Address,
    rentSysvar: Address,
    state: Address,
    referrerAccountOpt?: Address
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
        address: name,
        role: AccountRole.WRITABLE,
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
        address: buyer,
        role: AccountRole.WRITABLE_SIGNER,
      },
      {
        address: domainOwner,
        role: AccountRole.READONLY,
      },
      {
        address: feePayer,
        role: AccountRole.WRITABLE_SIGNER,
      },
      {
        address: buyerTokenSource,
        role: AccountRole.WRITABLE,
      },
      {
        address: pythFeedAccount,
        role: AccountRole.READONLY,
      },
      {
        address: vault,
        role: AccountRole.WRITABLE,
      },
      {
        address: splTokenProgram,
        role: AccountRole.READONLY,
      },
      {
        address: rentSysvar,
        role: AccountRole.READONLY,
      },
      {
        address: state,
        role: AccountRole.READONLY,
      },
    ];

    if (referrerAccountOpt) {
      accounts.push({
        address: referrerAccountOpt,
        role: AccountRole.WRITABLE,
      });
    }

    return {
      programAddress,
      accounts,
      data,
    };
  }
}
