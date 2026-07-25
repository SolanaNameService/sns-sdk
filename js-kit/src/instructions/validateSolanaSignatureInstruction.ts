import { AccountMeta, AccountRole, Address, Instruction } from "@solana/kit";
import { serialize } from "borsh";

/**
 * Input for validating a Solana signature for an SNS record.
 *
 * @example
 * ```ts
 * const params: ValidateSolanaSignatureInstructionParams = { staleness: false };
 * ```
 */
export interface ValidateSolanaSignatureInstructionParams {
  /** Whether to validate staleness. */
  staleness: boolean;
}

/** Builder for validating a Solana signature for an SNS record. */
export class ValidateSolanaSignatureInstruction {
  /** Instruction discriminator. */
  tag: number;
  /** Whether to validate staleness. */
  staleness: boolean;
  static schema = {
    struct: {
      tag: "u8",
      staleness: "bool",
    },
  };

  constructor(obj: ValidateSolanaSignatureInstructionParams) {
    this.tag = 3;
    this.staleness = obj.staleness;
  }

  serialize(): Uint8Array {
    return serialize(ValidateSolanaSignatureInstruction.schema, this);
  }

  getInstruction(
    programAddress: Address,
    systemProgram: Address,
    splNameServiceProgram: Address,
    feePayer: Address,
    record: Address,
    domain: Address,
    domainOwner: Address,
    centralState: Address,
    verifier: Address
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
        role: AccountRole.WRITABLE,
      },
      {
        address: centralState,
        role: AccountRole.READONLY,
      },
      {
        address: verifier,
        role: AccountRole.WRITABLE_SIGNER,
      },
    ];

    return {
      programAddress,
      accounts,
      data,
    };
  }
}
