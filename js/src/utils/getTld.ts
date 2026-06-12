export const SOL_TLD = ".sol";
export const SNS_TLD = ".sns";

export type SupportedTld = typeof SOL_TLD | typeof SNS_TLD;

/**
 * Returns the supported TLD of a domain string, or undefined if the domain
 * does not end with a recognised suffix.
 * Does not mutate the input.
 */
export const getTld = (domain: string): SupportedTld | undefined => {
  if (domain.endsWith(SOL_TLD)) return SOL_TLD;
  if (domain.endsWith(SNS_TLD)) return SNS_TLD;
  return undefined;
};
