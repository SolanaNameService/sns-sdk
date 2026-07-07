import {
  Address,
  ReadonlyUint8Array,
  getProgramDerivedAddress,
} from "@solana/kit";

import { addressCodec, utf8Codec } from "../codecs";
import { NAME_PROGRAM_ADDRESS } from "../constants/addresses";

const HASH_PREFIX = "SPL Name Service";

/**
 * Hashes the SPL Name Service hash prefix plus an input string using SHA-256.
 *
 * @param str Input string to hash
 * @returns Hash bytes.
 */
export const _generateHash = async (str: string): Promise<Uint8Array> => {
  const data = utf8Codec.encode(HASH_PREFIX + str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  return new Uint8Array(hashBuffer);
};

/**
 * Derives an SPL Name Service address from a hash.
 *
 * @param hash Hash bytes used as the first PDA seed
 * @param parentAddress Optional parent address seed
 * @param classAddress Optional class address seed
 * @returns The derived address.
 */
export const _getAddressFromHash = async (
  hash: Uint8Array,
  parentAddress?: Address,
  classAddress?: Address
): Promise<Address> => {
  const seeds: ReadonlyUint8Array[] = [hash];
  seeds.push(
    classAddress ? addressCodec.encode(classAddress) : new Uint8Array(32)
  );
  seeds.push(
    parentAddress ? addressCodec.encode(parentAddress) : new Uint8Array(32)
  );

  const [address] = await getProgramDerivedAddress({
    programAddress: NAME_PROGRAM_ADDRESS,
    seeds,
  });

  return address;
};

/**
 * Derives an address from an input string, with optional parent address and
 * optional class address. These addresses form part of the seeds for Program
 * Derived Address (PDA) derivation.
 *
 * @param str Input string to derive the address from
 * @param parentAddress Optional parent address seed
 * @param classAddress Optional class address seed
 * @returns The derived address.
 */
export const _deriveAddress = async (
  str: string,
  parentAddress?: Address,
  classAddress?: Address
) => {
  const hash = await _generateHash(str);
  const address = await _getAddressFromHash(hash, parentAddress, classAddress);

  return address;
};
