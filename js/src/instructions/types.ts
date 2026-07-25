import { PublicKey } from "@solana/web3.js";

/**
 * Account metadata used when constructing a Solana transaction instruction.
 *
 * @example
 * ```ts
 * const account: AccountKey = { pubkey: owner, isSigner: true, isWritable: false };
 * ```
 */
export interface AccountKey {
  /** Public key of the account. */
  pubkey: PublicKey;
  /** Whether the account must sign the transaction. */
  isSigner: boolean;
  /** Whether the instruction may modify the account. */
  isWritable: boolean;
}
