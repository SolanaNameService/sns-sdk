import { SOL_SRS_RESOLUTION_ENABLED } from "../config";
import { unsupportedTld } from "./unsupportedTld";

/** The Solana Name Service top-level-domain suffix. */
export const SOL_TLD = ".sol";

/** The SNS top-level-domain suffix. */
export const SNS_TLD = ".sns";

/** TLD suffixes accepted by the current SDK configuration. */
export const SUPPORTED_TLDS = SOL_SRS_RESOLUTION_ENABLED
  ? ([SNS_TLD] as const)
  : ([SNS_TLD, SOL_TLD] as const);

/** A top-level-domain suffix supported by SNS utilities. */
export type SupportedTld = typeof SNS_TLD | typeof SOL_TLD;

/**
 * Returns the matching TLD from `supportedTlds` if `domain` ends with one,
 * or `undefined` otherwise.
 *
 * @param domain Domain name including an optional suffix
 * @param supportedTlds Suffixes to match, defaulting to SDK-supported TLDs
 * @returns The matching suffix, or `undefined`
 *
 * @example
 * ```ts
 * const tld = getTld("example.sns");
 * ```
 */
export const getTld = (
  domain: string,
  supportedTlds: readonly string[] = SUPPORTED_TLDS,
): string | undefined => supportedTlds.find((tld) => domain.endsWith(tld));

/**
 * Validates that `domain` ends with one of the `supportedTlds`, strips that
 * suffix, and returns a `[trimmedDomain, tld]` tuple.
 *
 * @param domain Domain name including a supported suffix
 * @param supportedTlds Suffixes accepted by this parse operation
 * @returns The TLD-trimmed domain and matching suffix
 * @throws When the domain does not end with a supported suffix
 *
 * @example
 * ```ts
 * const [name, tld] = parseSupportedTld("example.sns");
 * ```
 */
export const parseSupportedTld = (
  domain: string,
  supportedTlds: readonly string[] = SUPPORTED_TLDS,
): [string, string] => {
  const tld = getTld(domain, supportedTlds);
  if (!tld) {
    throw unsupportedTld();
  }
  return [domain.slice(0, -tld.length), tld];
};

/**
 * Validates that `domain` ends with `.sns`, strips that suffix, and returns a
 * `[trimmedDomain, SNS_TLD]` tuple.
 *
 * @param domain Domain name including the `.sns` suffix
 * @returns The TLD-trimmed domain and `.sns`
 * @throws When the domain does not end with `.sns`
 *
 * @example
 * ```ts
 * const [name] = parseSnsTld("example.sns");
 * ```
 */
export const parseSnsTld = (domain: string): [string, string] => {
  if (!domain.endsWith(SNS_TLD)) {
    throw unsupportedTld();
  }

  return [domain.slice(0, -SNS_TLD.length), SNS_TLD];
};
