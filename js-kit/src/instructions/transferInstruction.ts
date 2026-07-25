import {
  AccountMeta,
  AccountRole,
  Address,
  Instruction,
  ReadonlyUint8Array,
} from "@solana/kit";
import { serialize } from "borsh";

import { addressCodec } from "../codecs";
import { DEFAULT_ADDRESS } from "../constants/addresses";

/**
 * Input for transferring an SNS name-registry account.
 *
 * @example
 * ```ts
 * const params: TransferInstructionParams = { newOwner };
 * ```
 */
export interface TransferInstructionParams {
  /** New registry owner. */
  newOwner: Address;
}

/** Builder for the SNS name-registry transfer instruction. */
export class TransferInstruction {
  /** Instruction discriminator. */
  tag: number;
  /** Encoded new owner address. */
  encodedNewOwnerAddress: ReadonlyUint8Array;

  static schema = {
    struct: {
      tag: "u8",
      encodedNewOwnerAddress: { array: { type: "u8", len: 32 } },
    },
  };

  constructor(obj: TransferInstructionParams) {
    this.tag = 2;
    this.encodedNewOwnerAddress = addressCodec.encode(obj.newOwner);
  }

  serialize(): Uint8Array {
    return serialize(TransferInstruction.schema, this);
  }

  getInstruction(
    programAddress: Address,
    domainAddress: Address,
    currentOwner: Address,
    classAddress?: Address,
    parentAddress?: Address,
    parentOwner?: Address
  ): Instruction {
    const data = this.serialize();

    const accounts: AccountMeta[] = [
      {
        address: domainAddress,
        role: AccountRole.WRITABLE,
      },
      {
        address: parentOwner ? parentOwner : currentOwner,
        role: AccountRole.READONLY_SIGNER,
      },
    ];

    if (classAddress) {
      accounts.push({
        address: classAddress,
        role: AccountRole.READONLY_SIGNER,
      });
    }

    if (parentOwner && parentAddress) {
      if (!classAddress) {
        accounts.push({
          address: DEFAULT_ADDRESS,
          role: AccountRole.READONLY,
        });
      }

      accounts.push({
        address: parentAddress,
        role: AccountRole.READONLY,
      });
    }

    return {
      programAddress,
      accounts,
      data,
    };
  }
}
