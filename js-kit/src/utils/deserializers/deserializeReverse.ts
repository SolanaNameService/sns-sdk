import { ReadonlyUint8Array } from "@solana/kit";

import { utf8Codec } from "../../codecs";

/**
 * Parameters for deserializing reverse account data.
 *
 * @example
 * ```ts
 * const params: DeserializeReverseParams = { data: reverseAccountData };
 * ```
 */
export interface DeserializeReverseParams {
  /** Reverse account data. */
  data: ReadonlyUint8Array | undefined;
  /** Whether to remove a subdomain's leading null byte. Defaults to false. */
  trimFirstNullByte?: boolean;
}

/**
 * Deserializes reverse account data.
 *
 * The first four bytes encode the reverse name length.
 *
 * @param params Reverse deserialization parameters
 * @param params.data Reverse account data. If undefined, returns undefined
 * @param params.trimFirstNullByte Whether to trim the first null byte for subdomain reverse names. Defaults to false
 * @returns The deserialized string, or `undefined` if data is undefined.
 *
 * @example
 * ```ts
 * const name = deserializeReverse({ data: reverseAccountData });
 * ```
 */
export function deserializeReverse({
  data,
  trimFirstNullByte,
}: DeserializeReverseParams): string;

export function deserializeReverse({
  data,
  trimFirstNullByte,
}: DeserializeReverseParams): undefined;

export function deserializeReverse({
  data,
  trimFirstNullByte = false,
}: DeserializeReverseParams): string | undefined {
  if (!data) return undefined;

  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const nameLength = view.getUint32(0, true);

  return utf8Codec
    .decode(data.subarray(4, 4 + nameLength))
    .replace(/^\0/, trimFirstNullByte ? "" : "\0");
}
