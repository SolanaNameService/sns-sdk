import { Connection } from "@solana/web3.js";

import { SOL_TLD_CUTOFF_SLOT } from "../config";
import { UnsupportedTldError } from "../error";
import { getTld, SOL_TLD } from "./tld";

const endpointsPastSolCutoff = new Set<string>();

const unsupportedTld = () =>
  new UnsupportedTldError("Domain has an unsupported TLD suffix");

/** Enforces mainnet runtime support without affecting pure derivation APIs. */
export const assertMainnetDomainSupported = async (
  connection: Connection,
  domain: string,
): Promise<void> => {
  const tld = getTld(domain);
  if (!tld) {
    throw unsupportedTld();
  }

  if (tld !== SOL_TLD) {
    return;
  }

  const endpoint = connection.rpcEndpoint;
  if (endpointsPastSolCutoff.has(endpoint)) {
    throw unsupportedTld();
  }

  const slot = await connection.getSlot("finalized");
  if (slot >= SOL_TLD_CUTOFF_SLOT) {
    endpointsPastSolCutoff.add(endpoint);
    throw unsupportedTld();
  }
};
