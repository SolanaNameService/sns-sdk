import type { Connection } from "@solana/web3.js";

import { SOL_TLD_CUTOFF_SLOT } from "../config";
import { getTld, SOL_TLD, unsupportedTld } from "./tld";

const endpointsPastSolCutoff = new Set<string>();

/**
 * Enforces TLD support without affecting pure derivation APIs.
 * Returns a `[trimmedDomain, tld]` tuple.
 */
export const assertTldSupported = async (
  connection: Connection,
  domain: string,
): Promise<[string, string]> => {
  const tld = getTld(domain);
  if (!tld) {
    throw unsupportedTld();
  }

  if (tld === SOL_TLD) {
    const endpoint = connection.rpcEndpoint;
    if (endpointsPastSolCutoff.has(endpoint)) {
      throw unsupportedTld();
    }

    const slot = await connection.getSlot("finalized");
    if (slot >= SOL_TLD_CUTOFF_SLOT) {
      endpointsPastSolCutoff.add(endpoint);
      throw unsupportedTld();
    }
  }

  return [domain.slice(0, -tld.length), tld];
};
