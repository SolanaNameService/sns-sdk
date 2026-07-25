import { Address, ReadonlyUint8Array } from "@solana/kit";

import { addressCodec } from "../../codecs";
import { _pointIsOnCurve } from "./ed25519";

function byteToHex(byte: number): string {
  const hexString = byte.toString(16);
  if (hexString.length === 1) {
    return `0${hexString}`;
  } else {
    return hexString;
  }
}

function decompressPointBytes(bytes: ReadonlyUint8Array): bigint {
  const hexString = bytes.reduce(
    (acc, byte, ii) => `${byteToHex(ii === 31 ? byte & ~0x80 : byte)}${acc}`,
    ""
  );
  const integerLiteralString = `0x${hexString}`;

  return BigInt(integerLiteralString);
}

/**
 * Returns whether a Solana address represents a valid Ed25519 curve point.
 *
 * @param address Solana address to validate
 * @returns Whether the address is an Ed25519 curve point
 *
 * @example
 * ```ts
 * const onCurve = checkAddressOnCurve(address);
 * ```
 */
export function checkAddressOnCurve(address: Address): boolean {
  const bytes = addressCodec.encode(address);
  if (bytes.byteLength !== 32) {
    return false;
  }
  const y = decompressPointBytes(bytes);

  return _pointIsOnCurve(y, bytes[31]);
}
