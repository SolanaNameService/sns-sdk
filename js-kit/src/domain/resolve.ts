import { Address } from "@solana/kit";

import { SOL_SRS_RESOLUTION_ENABLED } from "../config";
import { SnsSolResolutionMismatchError, UnsupportedTldError } from "../errors";
import { assertTldSupported } from "../utils/assertTldSupported";
import { SNS_TLD, SOL_TLD, parseSupportedTld } from "../utils/tld";
import { resolveSns } from "./resolveSns";
import { resolveSol } from "./resolveSol";
import { ResolveParams } from "./resolveTypes";

export type { ResolveOptions, ResolveParams } from "./resolveTypes";

/**
 * Resolves a `.sns` or `.sol` domain to its target address.
 *
 * @param params Resolution parameters
 * @param params.rpc RPC client implementing account, multiple-account, token-largest-account, and slot APIs
 * @param params.domain Full domain name including a `.sns` or `.sol` suffix
 * @param params.options Optional PDA owner resolution options. Defaults to `{ allowPda: false }`
 * @returns The resolved target address.
 *
 * @see {@link safeResolve} for `.sol` resolution that verifies the SRS and
 * corresponding SNS targets match when SRS-backed resolution is enabled.
 *
 * @example
 * ```ts
 * const address = await resolve({ rpc, domain: "example.sns" });
 * ```
 */
export const resolve = async ({
  rpc,
  domain,
  options = { allowPda: false },
}: ResolveParams): Promise<Address> => {
  if (domain.endsWith(SOL_TLD)) {
    const trimmedSolDomain = domain.slice(0, -SOL_TLD.length);

    if (SOL_SRS_RESOLUTION_ENABLED) {
      return resolveSol({ rpc, domain: trimmedSolDomain, options });
    }

    await assertTldSupported({ rpc, domain });
    return resolveSns({ rpc, domain: trimmedSolDomain, options });
  }

  const [trimmedDomain, tld] = parseSupportedTld(domain);
  if (tld === SNS_TLD) {
    return resolveSns({ rpc, domain: trimmedDomain, options });
  }

  throw new UnsupportedTldError(`Domain "${domain}" has an unsupported TLD`);
};

/**
 * Resolves a `.sns` or `.sol` domain using the same routing as {@link resolve}.
 *
 * When SRS-backed `.sol` resolution is enabled, both the `.sol` domain and its
 * corresponding `.sns` domain must resolve to the same target; otherwise,
 * {@link Errors.SnsSolResolutionMismatchError} is thrown.
 *
 * @param params Resolution parameters
 * @param params.rpc RPC client implementing account, multiple-account, token-largest-account, and slot APIs
 * @param params.domain Full domain name including a `.sns` or `.sol` suffix
 * @param params.options Optional PDA owner resolution options. Defaults to `{ allowPda: false }`
 * @returns The matching SRS and SNS target when compared; otherwise the target returned by {@link resolve}
 * @throws
 * - {@link Errors.SnsSolResolutionMismatchError} when SRS and SNS resolve a `.sol` domain to different addresses.
 * - Any resolution error propagated by {@link resolve}, `resolveSol`, or `resolveSns`.
 * @example
 * ```ts
 * const address = await safeResolve({ rpc, domain: "example.sol" });
 * ```
 */
export const safeResolve = async ({
  rpc,
  domain,
  options = { allowPda: false },
}: ResolveParams): Promise<Address> => {
  if (domain.endsWith(SOL_TLD) && SOL_SRS_RESOLUTION_ENABLED) {
    const trimmedSolDomain = domain.slice(0, -SOL_TLD.length);
    const [srsTarget, snsTarget] = await Promise.all([
      resolveSol({ rpc, domain: trimmedSolDomain, options }),
      resolveSns({ rpc, domain: trimmedSolDomain, options }),
    ]);

    if (srsTarget !== snsTarget) {
      throw new SnsSolResolutionMismatchError(
        `SRS resolved ${domain} to ${srsTarget}, but SNS resolved it to ${snsTarget}`
      );
    }

    return srsTarget;
  }

  return resolve({ rpc, domain, options });
};
