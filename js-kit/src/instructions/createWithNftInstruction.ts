import { AccountMeta, AccountRole, Address, Instruction } from "@solana/kit";
import { serialize } from "borsh";

/**
 * Input for registering an SNS domain backed by an NFT.
 *
 * @example
 * ```ts
 * const params: CreateWithNftInstructionParams = { name: "example", space: 1_000 };
 * ```
 */
export interface CreateWithNftInstructionParams {
  /** TLD-less domain name. */
  name: string;
  /** Account data size in bytes. */
  space: number;
}

/** Builder for registering an SNS domain backed by an NFT. */
export class CreateWithNftInstruction {
  /** Instruction discriminator. */
  tag: number;
  /** TLD-less domain name. */
  name: string;
  /** Account data size in bytes. */
  space: number;

  static schema = {
    struct: {
      tag: "u8",
      name: "string",
      space: "u32",
    },
  };

  constructor(obj: CreateWithNftInstructionParams) {
    this.tag = 17;
    this.name = obj.name;
    this.space = obj.space;
  }

  serialize(): Uint8Array {
    return serialize(CreateWithNftInstruction.schema, this);
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
    nftSource: Address,
    nftMetadata: Address,
    nftMint: Address,
    masterEdition: Address,
    collection: Address,
    splTokenProgram: Address,
    rentSysvar: Address,
    state: Address,
    mplTokenMetadata: Address
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
        address: nftSource,
        role: AccountRole.WRITABLE,
      },
      {
        address: nftMetadata,
        role: AccountRole.WRITABLE,
      },
      {
        address: nftMint,
        role: AccountRole.WRITABLE,
      },
      {
        address: masterEdition,
        role: AccountRole.WRITABLE,
      },
      {
        address: collection,
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
      {
        address: mplTokenMetadata,
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
