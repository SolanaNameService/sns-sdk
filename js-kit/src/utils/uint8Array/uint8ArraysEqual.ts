import { ReadonlyUint8Array } from "@solana/kit";

/**
 * Compares two byte arrays for equality.
 *
 * @param arr1 First byte array to compare
 * @param arr2 Second byte array to compare
 * @returns True if both arrays are equal, false otherwise.
 */
/** Compares two byte arrays for equal length and contents. */
export const uint8ArraysEqual = (
  arr1: ReadonlyUint8Array,
  arr2: ReadonlyUint8Array
): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every((value, index) => value === arr2[index]);
};
