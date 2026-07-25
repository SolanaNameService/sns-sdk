import { PublicKey } from "@solana/web3.js";

/**
 * Enables SRS-backed `.sol` resolution.
 *
 * `.sol` may only be removed from `SUPPORTED_TLDS` in a release where this is
 * also enabled. Otherwise `.sol` would be neither supported nor resolvable.
 */
export const SOL_SRS_RESOLUTION_ENABLED = false;

/**
 * First finalized mainnet slot where legacy `.sol` support is disabled.
 *
 * Estimated from finalized slot 432982620 at 2026-07-15T03:14:50Z using 2.5
 * slots per second through 2026-10-15T00:00:00Z. Confirm against mainnet
 * `getSlot` and `getBlockTime` before migration because slot production drifts.
 */
export const SOL_TLD_CUTOFF_SLOT = 452_825_395;

export const SOL_REGISTRAR_PROGRAM_ID = new PublicKey(
  "GaWnVJgCt174ZtPKiwrbSNxWFwckWbNeWVStLE92Gxj4",
);

export const SRS_PROGRAM_ID = new PublicKey(
  "srsWjm76StJucL7atFyPSdXFaVLNPFqEt1uFEDPrZsn",
);
