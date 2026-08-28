import { getTokenSize } from "@solana-program/token";
import { Address } from "@solana/kit";

import { addressCodec } from "../../codecs";

const TOKEN_METADATA_EXTENSION = 19;
const TOKEN_GROUP_MEMBER_EXTENSION = 23;
const TOKEN_2022_EXTENSION_HEADER_LENGTH = 4;
const TOKEN_GROUP_MEMBER_MIN_LENGTH = 64;

/**
 * Token Group Member data needed to authenticate an SRS mint.
 *
 * @example
 * ```ts
 * const member: TokenGroupMember = { mint, group };
 * ```
 */
export interface TokenGroupMember {
  /** Mint address referenced by the extension. */
  mint: Address;
  /** Group address referenced by the extension. */
  group: Address;
}

const readU16 = (data: Uint8Array, offset: number): number => {
  if (offset + 2 > data.length) {
    throw new Error("Token-2022 extension header is truncated");
  }

  return data[offset] | (data[offset + 1] << 8);
};

/**
 * Returns one Token-2022 mint extension payload from a serialized mint.
 *
 * The base mint layout and account-type byte precede the little-endian TLV
 * entries. Malformed entries are rejected rather than silently truncated.
 *
 * @param data Serialized Token-2022 mint account data
 * @param extensionType Numeric Token-2022 extension type to retrieve
 * @returns The extension payload, or `undefined` if the extension is absent
 * @throws Error If the TLV data is truncated or malformed
 *
 * @example
 * ```ts
 * const metadata = getToken2022MintExtension(data, 19);
 * ```
 */
export const getToken2022MintExtension = (
  data: Uint8Array,
  extensionType: number
): Uint8Array | undefined => {
  const tlvStart = getTokenSize() + 1;
  if (data.length < tlvStart) {
    return undefined;
  }

  const tlvData = data.subarray(tlvStart);
  let offset = 0;
  while (offset < tlvData.length) {
    if (offset + TOKEN_2022_EXTENSION_HEADER_LENGTH > tlvData.length) {
      throw new Error("Token-2022 extension header is truncated");
    }

    const type = readU16(tlvData, offset);
    const length = readU16(tlvData, offset + 2);
    const valueStart = offset + TOKEN_2022_EXTENSION_HEADER_LENGTH;
    const valueEnd = valueStart + length;
    if (valueEnd > tlvData.length) {
      throw new Error("Token-2022 extension is truncated");
    }

    if (type === extensionType) {
      return tlvData.subarray(valueStart, valueEnd);
    }

    offset = valueEnd;
  }

  return undefined;
};

/**
 * Returns the embedded Token-2022 Metadata extension payload, if present.
 *
 * @param data Serialized Token-2022 mint account data
 * @returns The Metadata extension payload, or `undefined` if it is absent
 * @throws Error If the TLV data is truncated or malformed
 */
export const getTokenMetadataExtension = (
  data: Uint8Array
): Uint8Array | undefined =>
  getToken2022MintExtension(data, TOKEN_METADATA_EXTENSION);

/**
 * Decodes the Token Group Member extension fields used by SRS validation.
 *
 * @param data Serialized Token-2022 mint account data
 * @returns The group member data, or `undefined` if the extension is absent
 * @throws Error If the extension payload is truncated or malformed
 */
export const getTokenGroupMember = (
  data: Uint8Array
): TokenGroupMember | undefined => {
  const extension = getToken2022MintExtension(
    data,
    TOKEN_GROUP_MEMBER_EXTENSION
  );
  if (!extension) {
    return undefined;
  }
  if (extension.length < TOKEN_GROUP_MEMBER_MIN_LENGTH) {
    throw new Error("Token Group Member extension is truncated");
  }

  return {
    mint: addressCodec.decode(extension.subarray(0, 32)),
    group: addressCodec.decode(extension.subarray(32, 64)),
  };
};
