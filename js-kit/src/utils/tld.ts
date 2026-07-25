import { SOL_SRS_RESOLUTION_ENABLED } from "../config";
import { UnsupportedTldError } from "../errors";

/** The Solana Name Service top-level domain. */
export const SOL_TLD = ".sol";

/** The Bonfida SNS top-level domain. */
export const SNS_TLD = ".sns";

/** A top-level domain supported by this SDK. */
export type SupportedTld = typeof SNS_TLD | typeof SOL_TLD;

/** TLD suffixes accepted by the domain parsing and resolution helpers. */
export const SUPPORTED_TLDS: readonly SupportedTld[] =
  SOL_SRS_RESOLUTION_ENABLED ? [SNS_TLD] : [SNS_TLD, SOL_TLD];

/**
 * Returns the matching TLD from `supportedTlds` if `domain` ends with one,
 * or `undefined` otherwise.
 *
 * @param domain Domain name to inspect
 * @param supportedTlds Supported suffixes to match against
 * @returns The matching suffix, or `undefined` when none match.
 *
 * @example
 * ```ts
 * const tld = getTld("example.sns");
 * ```
 */
export const getTld = (
  domain: string,
  supportedTlds: readonly string[] = SUPPORTED_TLDS
): string | undefined => supportedTlds.find((tld) => domain.endsWith(tld));

/**
 * Ensures `domain` ends with one of the `supportedTlds` and strips that suffix.
 *
 * @param domain Domain name to parse
 * @param supportedTlds Supported suffixes to match against
 * @returns Domain name without suffix and the matching suffix.
 * @throws UnsupportedTldError If no supported suffix matches.
 *
 * @example
 * ```ts
 * const [domain, tld] = parseSupportedTld("example.sns");
 * ```
 */
export const parseSupportedTld = (
  domain: string,
  supportedTlds: readonly string[] = SUPPORTED_TLDS
): [string, string] => {
  const tld = getTld(domain, supportedTlds);
  if (!tld) {
    throw new UnsupportedTldError(
      `Domain "${domain}" is missing a supported TLD suffix (${supportedTlds.join("/")})`
    );
  }
  return [domain.slice(0, -tld.length), tld];
};

/**
 * Ensures `domain` ends with `.sns` and strips that suffix.
 *
 * @param domain Domain name to parse
 * @returns Domain name without suffix and the `.sns` suffix.
 * @throws UnsupportedTldError If the domain does not end with `.sns`.
 *
 * @example
 * ```ts
 * const [domain] = parseSnsTld("example.sns");
 * ```
 */
export const parseSnsTld = (domain: string): [string, string] =>
  parseSupportedTld(domain, [SNS_TLD]);
