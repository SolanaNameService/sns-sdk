import { Buffer } from "buffer";
import { PublicKey } from "@solana/web3.js";
import { NAME_PROGRAM_ID } from "../constants";

/**
 * Derives a synchronous SPL Name Service account PDA from hashed name inputs.
 *
 * @param hashed_name SNS seed hash for the account name
 * @param nameClass Optional name class public key
 * @param nameParent Optional parent name account public key
 * @returns Derived name-service account public key
 *
 * @example
 * ```ts
 * const key = getNameAccountKeySync(getHashedNameSync("example"));
 * ```
 */
export const getNameAccountKeySync = (
  hashed_name: Buffer,
  nameClass?: PublicKey,
  nameParent?: PublicKey,
): PublicKey => {
  const seeds = [hashed_name];
  if (nameClass) {
    seeds.push(nameClass.toBuffer());
  } else {
    seeds.push(Buffer.alloc(32));
  }
  if (nameParent) {
    seeds.push(nameParent.toBuffer());
  } else {
    seeds.push(Buffer.alloc(32));
  }
  const [nameAccountKey] = PublicKey.findProgramAddressSync(
    seeds,
    NAME_PROGRAM_ID,
  );
  return nameAccountKey;
};
