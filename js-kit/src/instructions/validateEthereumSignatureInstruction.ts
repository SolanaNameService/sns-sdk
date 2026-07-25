import {
  AccountMeta,
  AccountRole,
  Address,
  Instruction,
  ReadonlyUint8Array,
} from "@solana/kit";
import { serialize } from "borsh";

/**
 * Input for validating an Ethereum signature for an SNS record.
 *
 * @example
 * ```ts
 * const params: ValidateEthereumSignatureInstructionParams = { validation, signature, expectedPubkey };
 * ```
 */
export interface ValidateEthereumSignatureInstructionParams {
  /** Validation mode discriminator. */
  validation: number;
  /** Ethereum signature. */
  signature: ReadonlyUint8Array;
  /** Expected Ethereum public key. */
  expectedPubkey: ReadonlyUint8Array;
}

/** Builder for validating an Ethereum signature for an SNS record. */
export class ValidateEthereumSignatureInstruction {
  /** Instruction discriminator. */
  tag: number;
  /** Validation mode discriminator. */
  validation: number;
  /** Ethereum signature. */
  signature: ReadonlyUint8Array;
  /** Expected Ethereum public key. */
  expectedPubkey: ReadonlyUint8Array;

  static schema = {
    struct: {
      tag: "u8",
      validation: "u8",
      signature: { array: { type: "u8" } },
      expectedPubkey: { array: { type: "u8" } },
    },
  };

  constructor(obj: ValidateEthereumSignatureInstructionParams) {
    this.tag = 4;
    this.validation = obj.validation;
    this.signature = obj.signature;
    this.expectedPubkey = obj.expectedPubkey;
  }

  serialize(): Uint8Array {
    return serialize(ValidateEthereumSignatureInstruction.schema, this);
  }

  getInstruction(
    programAddress: Address,
    systemProgram: Address,
    splNameServiceProgram: Address,
    feePayer: Address,
    record: Address,
    domain: Address,
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
        address: feePayer,
        role: AccountRole.WRITABLE_SIGNER,
      },
      {
        address: record,
        role: AccountRole.WRITABLE,
      },
      {
        address: domain,
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
