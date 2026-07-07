import { UnsupportedTldError } from "../errors";

export const SOL_TLD = ".sol";
export const SNS_TLD = ".sns";
export const SUPPORTED_TLDS = [SNS_TLD, SOL_TLD] as const;

export type SupportedTld = (typeof SUPPORTED_TLDS)[number];

/**
 * Returns the matching TLD from `supportedTlds` if `domain` ends with one,
 * or `undefined` otherwise.
 *
 * @param domain Domain name to inspect
 * @param supportedTlds Supported suffixes to match against
 * @returns The matching suffix, or `undefined` when none match.
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
 */
export const parseSnsTld = (domain: string): [string, string] =>
  parseSupportedTld(domain, [SNS_TLD]);
