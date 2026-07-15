import type { PublicKey } from "@solana/web3.js";

export type ResolveConfig =
  | { allowPda: false; programIds?: never }
  | { allowPda: "any"; programIds?: never }
  | { allowPda: true; programIds: PublicKey[] };
