/**
 * Converts a hexadecimal string to a Uint8Array.
 *
 * @param hexString Hexadecimal string to convert
 * @returns Decoded bytes.
 */
/** Converts an even-length hexadecimal string to a byte array. */
export const uint8ArrayFromHex = (hexString: string) => {
  const uint8Array = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    uint8Array[i / 2] = parseInt(hexString.slice(i, i + 2), 16);
  }
  return uint8Array;
};
