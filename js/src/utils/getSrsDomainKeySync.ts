import { PublicKey } from "@solana/web3.js";

import { SOL_REGISTRAR_PROGRAM_ID, SRS_PROGRAM_ID } from "../config";
import { SOL_TLD } from "./tld";

export const SRS_CENTRAL_STATE = PublicKey.findProgramAddressSync(
  [Buffer.from("central_state")],
  SOL_REGISTRAR_PROGRAM_ID,
)[0];

export const SOL_SRS_CLASS = PublicKey.findProgramAddressSync(
  [Buffer.from("class"), SRS_CENTRAL_STATE.toBuffer(), Buffer.from(SOL_TLD)],
  SRS_PROGRAM_ID,
)[0];

/**
 * Encodes a TLD-trimmed `.sol` domain name as the current SRS record seed.
 *
 * @param name Domain name with the `.sol` TLD suffix trimmed
 * @returns UTF-8 bytes used as the SRS record PDA seed
 */
export const getSrsRecordSeed = (name: string): Buffer =>
  Buffer.from(`name${name}`, "utf8");

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
