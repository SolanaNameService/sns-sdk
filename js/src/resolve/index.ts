import type { Connection, PublicKey } from "@solana/web3.js";

import { SOL_SRS_RESOLUTION_ENABLED } from "../config";
import { SnsSolResolutionMismatchError, UnsupportedTldError } from "../error";
import { assertTldSupported } from "../utils/assertTldSupported";
import { parseSupportedTld, SNS_TLD, SOL_TLD } from "../utils/tld";
import { resolveSns } from "./resolveSns";
import { resolveSol } from "./resolveSol";

import type { ResolveConfig } from "./types";

export type { ResolveConfig } from "./types";

/**
 * Resolves a full `.sns` or `.sol` domain name to its effective target public key.
 *
 * `.sns` resolution applies SNS ownership precedence: an active tokenized-domain
 * owner, then valid V2 and V1 `SOL` records, then the registry owner.
 *
 * `.sol` currently falls back to SNS-backed resolution until finalized slot
 * `452_825_395`, then pauses automatically. SRS-backed `.sol` resolution will be
 * restored in a future SDK update.
 *
 * @see {@link safeResolve} for `.sol` resolution that verifies the SRS and
 * corresponding SNS targets match when SRS-backed resolution is enabled.
 *
 * @param connection Solana RPC connection
 * @param domain Full domain name with a supported `.sns` or `.sol` suffix
 * @param config PDA allowance policy. Defaults to `{ allowPda: false }`
 * @returns Effective target as a web3.js `PublicKey`
 * @throws
 * - {@link Errors.UnsupportedTldError} when the name is bare, has an unsupported suffix, or uses `.sol` after the SDK-managed pause.
 * - {@link Errors.DomainDoesNotExist} when the domain account does not exist.
 * - {@link Errors.PdaOwnerNotAllowed} when the fallback registry owner is a PDA not allowed by `config`.
 * @example
 * ```ts
 * const target = await resolve(connection, "name.sns");
 * console.log(target.toBase58());
 * // => "<BASE58_PUBLIC_KEY>"
 * ```
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

/**
 * Resolves a full `.sns` or `.sol` domain using the same routing as
 * {@link resolve}.
 *
 * When SRS-backed `.sol` resolution is enabled, both the `.sol` domain and its
 * corresponding `.sns` domain must resolve to the same target; otherwise,
 * {@link Errors.SnsSolResolutionMismatchError} is thrown.
 *
 * @param connection Solana RPC connection
 * @param domain Full domain name with a supported `.sns` or `.sol` suffix
 * @param config PDA allowance policy. Defaults to `{ allowPda: false }`
 * @returns The matching SRS and SNS target when compared; otherwise the target returned by {@link resolve}
 * @throws
 * - {@link Errors.SnsSolResolutionMismatchError} when SRS and SNS resolve a `.sol` domain to different public keys.
 * - Any resolution error propagated by {@link resolve}, `resolveSol`, or `resolveSns`.
 * @example
 * ```ts
 * const target = await safeResolve(connection, "name.sol");
 * console.log(target.toBase58());
 * // => "<BASE58_PUBLIC_KEY>"
 * ```
 */
export const safeResolve = async (
  connection: Connection,
  domain: string,
  config: ResolveConfig = { allowPda: false },
): Promise<PublicKey> => {
  if (domain.endsWith(SOL_TLD) && SOL_SRS_RESOLUTION_ENABLED) {
    const trimmedDomain = domain.slice(0, -SOL_TLD.length);
    const [srsTarget, snsTarget] = await Promise.all([
      resolveSol(connection, trimmedDomain, config),
      resolveSns(connection, trimmedDomain, config),
    ]);

    if (!srsTarget.equals(snsTarget)) {
      throw new SnsSolResolutionMismatchError(
        `SRS resolved ${domain} to ${srsTarget.toBase58()}, but SNS resolved it to ${snsTarget.toBase58()}`,
      );
    }

    return srsTarget;
  }

  return resolve(connection, domain, config);
};
