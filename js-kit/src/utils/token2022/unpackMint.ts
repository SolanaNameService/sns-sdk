import { getMintDecoder, getMintSize } from "@solana-program/token";
import { ReadonlyUint8Array } from "@solana/kit";

import { assertValidAccountData } from "./assertValidAccountData";

const TOKEN_2022_MINT_ACCOUNT_TYPE = 1;
const mintDecoder = getMintDecoder();
const mintSize = getMintSize();

/**
 * Decodes the base mint state from SPL Token or Token-2022 account data.
 *
 * For Token-2022 data, only the base mint layout is decoded. The surrounding
 * Token-2022 envelope is validated, but extension payloads are not decoded.
 *
 * @param data Serialized mint account data
 * @returns The decoded mint state
 * @throws Error If the data does not contain a valid mint layout or Token-2022 mint envelope
 */
export const unpackMint = (data: ReadonlyUint8Array) => {
  assertValidAccountData(data, mintSize, TOKEN_2022_MINT_ACCOUNT_TYPE);
  return mintDecoder.decode(data.slice(0, mintSize));
};
