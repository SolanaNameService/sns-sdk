import type { Address, Slot } from "@solana/kit";

/** Whether `.sol` resolution through the Solana Registration Service is disabled. */
export const SOL_SRS_RESOLUTION_ENABLED = false;
/** Slot after which `.sol` domains use the Solana Registration Service. */
export const SOL_TLD_CUTOFF_SLOT = 452_825_395n as Slot;
/** Program address of the Solana Registration Service registrar. */
export const SOL_REGISTRAR_PROGRAM_ADDRESS =
  "GaWnVJgCt174ZtPKiwrbSNxWFwckWbNeWVStLE92Gxj4" as Address;
/** Program address of the Solana Registration Service. */
export const SRS_PROGRAM_ADDRESS =
  "srsWjm76StJucL7atFyPSdXFaVLNPFqEt1uFEDPrZsn" as Address;
/** Seed prefix used when deriving Solana Registration Service accounts. */
export const SRS_HASH_PREFIX = "SRS";
