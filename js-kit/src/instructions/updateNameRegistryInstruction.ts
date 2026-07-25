import { AccountMeta, AccountRole, Address, Instruction } from "@solana/kit";
import { serialize } from "borsh";

/**
 * Input for updating an SNS name-registry account.
 *
 * @example
 * ```ts
 * const params: UpdateNameRegistryInstructionParams = { offset: 0, inputData };
 * ```
 */
export interface UpdateNameRegistryInstructionParams {
  /** Byte offset where the update begins. */
  offset: number;
  /** Bytes to write. */
  inputData: Uint8Array;
}

/** Builder for updating the data of an SNS name-registry account. */
export class UpdateNameRegistryInstruction {
  /** Instruction discriminator. */
  tag: number;
  /** Byte offset where the update begins. */
  offset: number;
  /** Bytes to write. */
  inputData: Uint8Array;

  static schema = {
    struct: {
      tag: "u8",
      offset: "u32",
      inputData: { array: { type: "u8" } },
    },
  };

  constructor(obj: UpdateNameRegistryInstructionParams) {
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
