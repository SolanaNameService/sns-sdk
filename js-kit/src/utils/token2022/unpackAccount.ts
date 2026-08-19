import { getTokenDecoder, getTokenSize } from "@solana-program/token";
import { ReadonlyUint8Array } from "@solana/kit";

import { assertValidAccountData } from "./assertValidAccountData";

const TOKEN_2022_TOKEN_ACCOUNT_TYPE = 2;
const tokenDecoder = getTokenDecoder();
const tokenSize = getTokenSize();

/**
 * Decodes the base token-account state from SPL Token or Token-2022 account
 * data.
 *
 * For Token-2022 data, only the base token-account layout is decoded. The
 * surrounding Token-2022 envelope is validated, but extension payloads are
 * not decoded.
 *
 * @param data Serialized token-account data
 * @returns The decoded token-account state
 * @throws Error If the data does not contain a valid token-account layout or Token-2022 account envelope
 */
export const unpackAccount = (data: ReadonlyUint8Array) => {
  assertValidAccountData(data, tokenSize, TOKEN_2022_TOKEN_ACCOUNT_TYPE);
  return tokenDecoder.decode(data.slice(0, tokenSize));
};
