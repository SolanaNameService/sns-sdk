import type { Connection, PublicKey } from "@solana/web3.js";

import { SOL_SRS_RESOLUTION_ENABLED } from "../config";
import { UnsupportedTldError } from "../error";
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
