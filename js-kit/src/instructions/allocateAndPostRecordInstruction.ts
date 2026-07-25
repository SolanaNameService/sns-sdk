import {
  AccountMeta,
  AccountRole,
  Address,
  Instruction,
  ReadonlyUint8Array,
} from "@solana/kit";
import { serialize } from "borsh";

/**
 * Input for allocating and writing an SNS V2 record.
 *
 * @example
 * ```ts
 * const params: AllocateAndPostRecordInstructionParams = { record, content };
 * ```
 */
export interface AllocateAndPostRecordInstructionParams {
  /** Encoded V2 record label. */
  record: string;
  /** Serialized record content. */
  content: ReadonlyUint8Array;
}

/** Builder for allocating and writing an SNS V2 record account. */
export class AllocateAndPostRecordInstruction {
  /** Instruction discriminator. */
  tag: number;
  /** Encoded V2 record label. */
  record: string;
  /** Serialized record content. */
  content: ReadonlyUint8Array;

  static schema = {
    struct: {
      tag: "u8",
      record: "string",
      content: { array: { type: "u8" } },
    },
  };

  constructor(obj: AllocateAndPostRecordInstructionParams) {
    this.tag = 1;
    this.record = obj.record;
    this.content = obj.content;
  }

  serialize(): Uint8Array {
    return serialize(AllocateAndPostRecordInstruction.schema, this);
  }

  getInstruction(
    programAddress: Address,
    systemProgram: Address,
    splNameServiceProgram: Address,
    payer: Address,
    record: Address,
    domainAddress: Address,
    domainOwner: Address,
    centralState: Address
  ): Instruction {
    const data = this.serialize();

    const accounts: AccountMeta[] = [
      {
        address: systemProgram,
        role: AccountRole.READONLY,
      },
      {
        address: splNameServiceProgram,
        role: AccountRole.READONLY,
      },
      {
        address: payer,
        role: AccountRole.WRITABLE_SIGNER,
      },
      {
        address: record,
        role: AccountRole.WRITABLE,
      },
      {
        address: domainAddress,
        role: AccountRole.WRITABLE,
      },
      {
        address: domainOwner,
        role: AccountRole.WRITABLE_SIGNER,
      },
      {
        address: centralState,
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
