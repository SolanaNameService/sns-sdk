import { SOL_SRS_RESOLUTION_ENABLED } from "../config";
import { unsupportedTld } from "./unsupportedTld";

export const SOL_TLD = ".sol";
export const SNS_TLD = ".sns";
export const SUPPORTED_TLDS = SOL_SRS_RESOLUTION_ENABLED
  ? ([SNS_TLD] as const)
  : ([SNS_TLD, SOL_TLD] as const);

export type SupportedTld = typeof SNS_TLD | typeof SOL_TLD;

/**
 * Returns the matching TLD from `supportedTlds` if `domain` ends with one,
 * or `undefined` otherwise.
 */
export const getTld = (
  domain: string,
  supportedTlds: readonly string[] = SUPPORTED_TLDS,
): string | undefined => supportedTlds.find((tld) => domain.endsWith(tld));

/**
 * Validates that `domain` ends with one of the `supportedTlds`, strips that
 * suffix, and returns a `[trimmedDomain, tld]` tuple.
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
 */
export const parseSnsTld = (domain: string): [string, string] => {
  if (!domain.endsWith(SNS_TLD)) {
    throw unsupportedTld();
  }

  return [domain.slice(0, -SNS_TLD.length), SNS_TLD];
};
