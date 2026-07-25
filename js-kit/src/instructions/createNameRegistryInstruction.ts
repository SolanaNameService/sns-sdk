import { AccountMeta, AccountRole, Address, Instruction } from "@solana/kit";
import { serialize } from "borsh";

import { DEFAULT_ADDRESS } from "../constants/addresses";

/**
 * Input for creating an SNS name-registry account.
 *
 * @example
 * ```ts
 * const params: CreateNameRegistryInstructionParams = { nameHash, lamports, space: 32 };
 * ```
 */
export interface CreateNameRegistryInstructionParams {
  /** Hash of the registry name. */
  nameHash: Uint8Array;
  /** Account funding amount. */
  lamports: bigint;
  /** Account data size in bytes. */
  space: number;
}

/** Builder for creating an SNS name-registry account. */
export class CreateNameRegistryInstruction {
  /** Instruction discriminator. */
  tag: number;
  /** Hash of the registry name. */
  nameHash: Uint8Array;
  /** Account funding amount. */
  lamports: bigint;
  /** Account data size in bytes. */
  space: number;

  static schema = {
    struct: {
      tag: "u8",
      nameHash: { array: { type: "u8" } },
      lamports: "u64",
      space: "u32",
    },
  };

  constructor(obj: CreateNameRegistryInstructionParams) {
    this.tag = 0;
    this.nameHash = obj.nameHash;
    this.lamports = obj.lamports;
    this.space = obj.space;
  }

  serialize(): Uint8Array {
    return serialize(CreateNameRegistryInstruction.schema, this);
  }

  getInstruction(
    programAddress: Address,
    systemProgram: Address,
    domainAddress: Address,
    owner: Address,
    payer: Address,
    classAddress?: Address,
    parentAddress?: Address,
    parentOwner?: Address
  ): Instruction {
    const data = this.serialize();

    const accounts: AccountMeta[] = [
      {
        address: systemProgram,
        role: AccountRole.READONLY,
      },
      {
        address: payer,
        role: AccountRole.WRITABLE_SIGNER,
      },
      {
        address: domainAddress,
        role: AccountRole.WRITABLE,
      },
      {
        address: owner,
        role: AccountRole.READONLY,
      },
    ];

    if (classAddress) {
      accounts.push({
        address: classAddress,
        role: AccountRole.READONLY_SIGNER,
      });
    } else {
      accounts.push({
        address: DEFAULT_ADDRESS,
        role: AccountRole.READONLY,
      });
    }

    if (parentAddress) {
      accounts.push({
        address: parentAddress,
        role: AccountRole.READONLY,
      });
    } else {
      accounts.push({
        address: DEFAULT_ADDRESS,
        role: AccountRole.READONLY,
      });
    }

    if (parentOwner) {
      accounts.push({
        address: parentOwner,
        role: AccountRole.READONLY_SIGNER,
      });
    }

    return {
      programAddress,
      accounts,
      data,
    };
  }
}
