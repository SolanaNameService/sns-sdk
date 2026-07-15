import type { Connection, PublicKey } from "@solana/web3.js";

import { SOL_SRS_RESOLUTION_ENABLED } from "../config";
import { UnsupportedTldError } from "../error";
import { assertTldSupported } from "../utils/assertTldSupported";
import {
  parseSupportedTld,
  SNS_TLD,
  SOL_TLD,
} from "../utils/tld";
import { resolveSns } from "./resolveSns";
import { resolveSol } from "./resolveSol";

import type { ResolveConfig } from "./types";

export type { ResolveConfig } from "./types";

/**
 * Resolves a domain to its owner public key.
 *
 * A TLD suffix is required. `.sns` uses SNS-IP 5. `.sol` uses SRS when
 * enabled by package configuration; otherwise SNS resolution is available
 * only before the configured cutoff.
 *
 * @param connection Solana RPC connection
 * @param domain Full `.sns` or `.sol` domain name
 * @param config Optional PDA allowance config
 * @returns Resolved owner public key
 * @throws {UnsupportedTldError} When the domain has an unsupported TLD suffix
 */
export const resolve = async (
  connection: Connection,
  domain: string,
  config: ResolveConfig = { allowPda: false },
): Promise<PublicKey> => {
  if (domain.endsWith(SOL_TLD)) {
    const trimmedDomain = domain.slice(0, -SOL_TLD.length);

    if (SOL_SRS_RESOLUTION_ENABLED) {
      return resolveSol(connection, trimmedDomain, config);
    }

    await assertTldSupported(connection, domain);
    return resolveSns(connection, trimmedDomain, config);
  }

  const [trimmedDomain, tld] = parseSupportedTld(domain);
  if (tld === SNS_TLD) {
    return resolveSns(connection, trimmedDomain, config);
  }

  throw new UnsupportedTldError("Domain has an unsupported TLD suffix");
};
