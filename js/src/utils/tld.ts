import { UnsupportedTldError } from "../error";

export const SOL_TLD = ".sol";
export const SNS_TLD = ".sns";
export const SUPPORTED_TLDS = [SNS_TLD, SOL_TLD] as const;

export type SupportedTld = (typeof SUPPORTED_TLDS)[number];

export const unsupportedTld = () =>
  new UnsupportedTldError("Domain has an unsupported TLD suffix");

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
    throw new UnsupportedTldError("Domain has an unsupported TLD suffix");
  }

  return [domain.slice(0, -SNS_TLD.length), SNS_TLD];
};
