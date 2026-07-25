import { Buffer } from "buffer";

/**
 * Decodes an SNS reverse-lookup account payload into a domain name.
 *
 * @param data Encoded reverse-lookup account payload
 * @param trimFirstNullByte Whether to remove the leading subdomain marker
 * @returns The decoded domain name
 *
 * @example
 * ```ts
 * const name = deserializeReverse(reverseAccountData);
 * ```
 */
export function deserializeReverse(
  data: Buffer,
  trimFirstNullByte?: boolean,
): string;
/**
 * Decodes an absent reverse-lookup payload to `undefined`.
 *
 * @returns `undefined`
 */
export function deserializeReverse(
  data: undefined,
  trimFirstNullByte?: boolean,
): undefined;

/**
 * Decodes an SNS reverse-lookup account payload into a domain name.
 *
 * @param data Encoded reverse-lookup account payload
 * @param trimFirstNullByte Whether to remove the leading subdomain marker
 * @returns The decoded domain name, or `undefined` when data is absent
 *
 * @example
 * ```ts
 * const name = deserializeReverse(reverseAccountData);
 * ```
 */
export function deserializeReverse(
  data: Buffer | undefined,
  trimFirstNullByte = false,
): string | undefined {
  if (!data) return undefined;
  const nameLength = data.subarray(0, 4).readUInt32LE(0);
  return data
    .subarray(4, 4 + nameLength)
    .toString()
    .replace(/^\0/, trimFirstNullByte ? "" : "\0");
}
