import { getMultisigSize, getTokenSize } from "@solana-program/token";
import { ReadonlyUint8Array } from "@solana/kit";

const TOKEN_2022_ACCOUNT_TYPE_OFFSET = getTokenSize();
const TOKEN_MULTISIG_SIZE = getMultisigSize();

/**
 * Validates the base layout or Token-2022 account envelope of serialized
 * account data.
 *
 * Data with exactly `baseSize` bytes is accepted as a base SPL Token layout.
 * Data with another length must contain the expected Token-2022 account type
 * at the account-type offset and must not have the Token multisig size.
 *
 * This validates only the outer account envelope. It does not decode or
 * validate Token-2022 extension payloads.
 *
 * @param data Serialized SPL Token or Token-2022 account data
 * @param baseSize Expected size of the base account layout
 * @param accountType Expected Token-2022 account type discriminator
 * @throws Error If the data has an invalid size or account type
 */
export const assertValidAccountData = (
  data: ReadonlyUint8Array,
  baseSize: number,
  accountType: number
): void => {
  if (data.length === baseSize) {
    return;
  }

  if (
    data.length <= TOKEN_2022_ACCOUNT_TYPE_OFFSET ||
    data.length === TOKEN_MULTISIG_SIZE ||
    data[TOKEN_2022_ACCOUNT_TYPE_OFFSET] !== accountType
  ) {
    throw new Error("Invalid Token-2022 account data");
  }
};
