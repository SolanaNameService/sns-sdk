import type { Connection, PublicKey } from "@solana/web3.js";

import { SnsSolResolutionMismatchError } from "../error";
import { parseSupportedTld, SNS_TLD, SOL_TLD } from "../utils/tld";
import { unsupportedTld } from "../utils/unsupportedTld";
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
 * `.sol` resolution reads and validates the canonical SRS record. It resolves
 * either the record's direct public-key owner or the unique current holder of
 * its canonical token mint.
 *
 * @see {@link safeResolve} for `.sol` resolution that additionally requires the
 * SRS target to match the corresponding SNS target.
 *
 * @param connection Solana RPC connection
 * @param domain Full domain name with a supported `.sns` or `.sol` suffix
 * @param config PDA allowance policy. Defaults to `{ allowPda: false }`
 * @returns Effective target as a web3.js `PublicKey`
 * @throws
 * - {@link Errors.UnsupportedTldError} when the name is bare or has an unsupported suffix.
 * - {@link Errors.DomainDoesNotExist} when the SNS registry or canonical SRS record does not exist.
 * - {@link Errors.DomainExpired} when an SRS record has expired.
 * - {@link Errors.RecordMalformed} when the on-chain data required for resolution is malformed or invalid.
 * - {@link Errors.CouldNotFindNftOwner} when an active tokenized SNS domain owner cannot be found.
 * - {@link Errors.CouldNotFindSrsOwner} when a tokenized SRS owner cannot be resolved.
 * - {@link Errors.WrongValidation} when an SNS V2 `SOL` record uses unsupported validation types.
 * - {@link Errors.InvalidRoaError} when an SNS V2 `SOL` record fails right-of-association validation.
 * - {@link Errors.PdaOwnerNotAllowed} when the effective owner is a PDA not allowed by `config`.
 *
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
    return resolveSol(connection, trimmedDomain, config);
  }

  const [trimmedDomain, tld] = parseSupportedTld(domain);
  if (tld === SNS_TLD) {
    return resolveSns(connection, trimmedDomain, config);
  }

  throw unsupportedTld();
};

/**
 * Resolves a full `.sns` or `.sol` domain using the same routing as
 * {@link resolve}. For domains with `.sol` suffix, the corresponding `.sns`
 * domain must resolve to the same target; otherwise,
 * {@link Errors.SnsSolResolutionMismatchError} is thrown.
 *
 * @param connection Solana RPC connection
 * @param domain Full domain name with a supported `.sns` or `.sol` suffix
 * @param config PDA allowance policy. Defaults to `{ allowPda: false }`
 * @returns The matching SRS and SNS target when compared; otherwise the target returned by {@link resolve}
 * @throws
 * - {@link Errors.SnsSolResolutionMismatchError} when SRS and SNS resolve a `.sol` domain to different public keys.
 * - Any resolution error propagated by {@link resolve}, `resolveSol`, or `resolveSns`.
 *
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
  if (domain.endsWith(SOL_TLD)) {
    const trimmedDomain = domain.slice(0, -SOL_TLD.length);
    const [solResult, snsResult] = await Promise.allSettled([
      resolveSol(connection, trimmedDomain, config),
      resolveSns(connection, trimmedDomain, config),
    ]);

    if (solResult.status === "rejected") {
      throw solResult.reason;
    }

    if (snsResult.status === "rejected") {
      throw snsResult.reason;
    }

    const solTarget = solResult.value;
    const snsTarget = snsResult.value;

    if (!solTarget.equals(snsTarget)) {
      throw new SnsSolResolutionMismatchError(
        `SRS resolved ${domain} to ${solTarget.toBase58()}, but SNS resolved it to ${snsTarget.toBase58()}`,
      );
    }

    return solTarget;
  }

  return resolve(connection, domain, config);
};
