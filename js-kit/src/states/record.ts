import {
  Address,
  GetAccountInfoApi,
  GetMultipleAccountsApi,
  Rpc,
  fetchEncodedAccount,
  fetchEncodedAccounts,
} from "@solana/kit";
import { Schema, deserialize } from "borsh";

import {
  InvalidSerializedDataError,
  InvalidValidationError,
  NoRecordDataError,
} from "../errors";
import { Validation } from "../types/validation";

/** Byte length of the common SNS name-registry account header. */
export const NAME_REGISTRY_LEN = 96;

/**
 * Returns the byte length of an identifier encoded for a validation mode.
 *
 * @example
 * ```ts
 * const length = getValidationLength(Validation.Solana);
 * ```
 */
export const getValidationLength = (validation: Validation) => {
  switch (validation) {
    case Validation.None:
      return 0;
    case Validation.Ethereum:
      return 20;
    case Validation.Solana:
      return 32;
    case Validation.UnverifiedSolana:
      return 32;
    default:
      throw new InvalidValidationError("Invalid validation enum");
  }
};

/**
 * Input for decoding an SNS V2 record header.
 *
 * @example
 * ```ts
 * const params: RecordHeaderStateParams = { stalenessValidation: 0, rightOfAssociationValidation: 0, contentLength: 0 };
 * ```
 */
export interface RecordHeaderStateParams {
  /** Staleness validation mode. */
  stalenessValidation: number;
  /** Right of Association validation mode. */
  rightOfAssociationValidation: number;
  /** Record content length in bytes. */
  contentLength: number;
}

/** Decoded header of an SNS V2 record account. */
export class RecordHeaderState {
  /** Staleness validation mode. */
  stalenessValidation: number;
  /** Right of Association validation mode. */
  rightOfAssociationValidation: number;
  /** Record content length in bytes. */
  contentLength: number;

  static schema: Schema = {
    struct: {
      stalenessValidation: "u16",
      rightOfAssociationValidation: "u16",
      contentLength: "u32",
    },
  };

  // The total length of the struct is calculated as the sum of:
  // - `stalenessValidation`: 2 bytes (`u16`)
  // - `rightOfAssociationValidation`: 2 bytes (`u16`)
  // - `contentLength`: 4 bytes (`u32`)
  static LEN = 8;

  constructor(obj: RecordHeaderStateParams) {
    this.stalenessValidation = obj.stalenessValidation;
    this.rightOfAssociationValidation = obj.rightOfAssociationValidation;
    this.contentLength = obj.contentLength;
  }

  static deserialize(data: Uint8Array): RecordHeaderState {
    return new RecordHeaderState(deserialize(this.schema, data, true) as any);
  }

  static async retrieve(
    rpc: Rpc<GetAccountInfoApi>,
    address: Address
  ): Promise<RecordHeaderState> {
    const recordAccount = await fetchEncodedAccount(rpc, address);

    if (!recordAccount.exists) {
      throw new NoRecordDataError("Record account not found");
    }

    return this.deserialize(
      recordAccount.data.slice(NAME_REGISTRY_LEN, NAME_REGISTRY_LEN + this.LEN)
    );
  }
}

/** Decoded SNS V2 record account, including its validation data and content. */
export class RecordState {
  /** Decoded record header. */
  header: RecordHeaderState;
  /** Validation identifiers and record content. */
  data: Uint8Array;

  constructor(header: RecordHeaderState, data: Uint8Array) {
    this.data = data;
    this.header = header;
  }

  static deserialize(data: Uint8Array): RecordState {
    const offset = NAME_REGISTRY_LEN;
    const header = RecordHeaderState.deserialize(
      data.slice(offset, offset + RecordHeaderState.LEN)
    );

    return new RecordState(header, data.slice(offset + RecordHeaderState.LEN));
  }

  static async retrieve(
    rpc: Rpc<GetAccountInfoApi>,
    address: Address
  ): Promise<RecordState> {
    const recordAccount = await fetchEncodedAccount(rpc, address);
    if (!recordAccount.exists) {
      throw new NoRecordDataError("Record account not found");
    }

    return this.deserialize(recordAccount.data);
  }

  static async retrieveBatch(
    rpc: Rpc<GetMultipleAccountsApi>,
    addresses: Address[]
  ): Promise<(RecordState | undefined)[]> {
    const recordAccounts = await fetchEncodedAccounts(rpc, addresses);

    return recordAccounts.map((account) =>
      account.exists ? this.deserialize(account.data) : undefined
    );
  }

  getContent(): Uint8Array {
    const startOffset =
      getValidationLength(this.header.stalenessValidation) +
      getValidationLength(this.header.rightOfAssociationValidation);
    const endOffset = startOffset + this.header.contentLength;
    if (endOffset > this.data.length) {
      throw new InvalidSerializedDataError(
        "Record content length exceeds account data"
      );
    }

    return this.data.slice(startOffset, endOffset);
  }

  getStalenessId(): Uint8Array {
    const endOffset = getValidationLength(this.header.stalenessValidation);

    return this.data.slice(0, endOffset);
  }

  getRoAId(): Uint8Array {
    const startOffset = getValidationLength(this.header.stalenessValidation);
    const endOffset =
      startOffset +
      getValidationLength(this.header.rightOfAssociationValidation);

    return this.data.slice(startOffset, endOffset);
  }
}
