import { UnsupportedTldError } from "../error";

export const SOL_TLD = ".sol";
export const SNS_TLD = ".sns";

/** The two TLD suffixes recognised by default. */
export type SupportedTld = typeof SOL_TLD | typeof SNS_TLD;

/**
 * Returns the matching TLD from `supportedTlds` if `domain` ends with one,
 * or `undefined` otherwise.
 *
 * @param domain The full domain name (e.g. `"bonfida.sol"`)
 * @param supportedTlds The list of accepted TLD suffixes. Defaults to `[SNS_TLD, SOL_TLD]`.
 */
export const getTld = (
  domain: string,
  supportedTlds: string[] = [SNS_TLD, SOL_TLD],
): string | undefined => supportedTlds.find((tld) => domain.endsWith(tld));

/**
 * Validates that `domain` ends with one of the `supportedTlds`, strips that
 * suffix, and returns a `[trimmedDomain, tld]` tuple
 * (e.g. `"bonfida.sol"` → `["bonfida", ".sol"]`).
 *
 * @param domain The full domain name including TLD (e.g. `"bonfida.sol"`)
 * @param supportedTlds The list of accepted TLD suffixes. Defaults to `[SNS_TLD, SOL_TLD]`.
 * @returns A tuple of the bare domain and the matched TLD suffix
 * @throws {UnsupportedTldError} When the domain does not end with any of the supported TLDs
 */
export const parseSupportedTld = (
  domain: string,
  supportedTlds: string[] = [SNS_TLD, SOL_TLD],
): [string, string] => {
  const tld = getTld(domain, supportedTlds);
  if (!tld) {
    throw new UnsupportedTldError(
      `Domain "${domain}" is missing a supported TLD suffix (${supportedTlds.join("/")})`,
    );
  }
  return [domain.slice(0, -tld.length), tld];
};
