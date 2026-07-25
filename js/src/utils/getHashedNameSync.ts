import { Buffer } from "buffer";
import { sha256 } from "@noble/hashes/sha2";
import { SNS_HASH_PREFIX } from "../constants";

/**
 * Hashes a name using the SNS name-service seed derivation.
 *
 * @param name Name or seed string to hash
 * @returns SHA-256 name-service seed hash
 *
 * @example
 * ```ts
 * const hash = getHashedNameSync("example");
 * ```
 */
export const getHashedNameSync = (name: string): Buffer => {
  const input = SNS_HASH_PREFIX + name;
  const hashed = sha256(Buffer.from(input, "utf8"));
  return Buffer.from(hashed);
};
