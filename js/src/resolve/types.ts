import type { PublicKey } from "@solana/web3.js";

/** Controls whether resolution may return program-derived-address owners. */
export type ResolveConfig =
  | { allowPda: false; programIds?: never }
  | { allowPda: "any"; programIds?: never }
  | { allowPda: true; programIds: PublicKey[] };
