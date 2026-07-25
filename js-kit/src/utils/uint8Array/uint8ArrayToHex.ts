import { ReadonlyUint8Array } from "@solana/kit";

/**
 * Converts bytes to a lowercase hexadecimal string.
 *
 * @param arr Bytes to convert
 * @returns Lowercase hexadecimal string.
 */
/** Converts a byte array to a lowercase hexadecimal string. */
export const uint8ArrayToHex = (arr: ReadonlyUint8Array) =>
  Array.from(arr)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
