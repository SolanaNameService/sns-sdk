import { Buffer } from "buffer";

import { sha256 } from "@noble/hashes/sha2";
import { PublicKey } from "@solana/web3.js";

import { SRS_PROGRAM_ID } from "../config";
import { SOL_SRS_CLASS, SRS_HASH_PREFIX } from "../constants";

/**
 * Encodes a TLD-trimmed `.sol` domain name as the current SRS record seed.
 *
 * @param name Domain name with the `.sol` TLD suffix trimmed
 * @returns UTF-8 bytes used as the SRS record PDA seed
 */
export const getSrsRecordSeed = (name: string): Buffer => {
  // Buffer.from(`name${name}`, "utf8");
  const input = SRS_HASH_PREFIX + name;
  const hashed = sha256(Buffer.from(input, "utf8"));
  return Buffer.from(hashed);
};

/**
 * Derives the canonical SRS record account for a `.sol` domain.
 *
 * The caller must trim the `.sol` TLD suffix before calling this function.
 *
 * @param domain Domain name with the `.sol` TLD suffix trimmed
 * @returns Canonical SRS record public key and the seed used to derive it
 * @throws {TypeError} When the current record seed exceeds 32 bytes
 */
export const getSrsDomainKeySync = (
  domain: string,
): {
  pubkey: PublicKey;
  hashed: Buffer;
} => {
  const hashed = getSrsRecordSeed(domain);

  const [pubkey] = PublicKey.findProgramAddressSync(
    [Buffer.from("record"), SOL_SRS_CLASS.toBuffer(), hashed],
    SRS_PROGRAM_ID,
  );

  return { pubkey, hashed };
};
