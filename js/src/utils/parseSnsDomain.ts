import { InvalidDomainError, InvalidSubdomainError } from "../error";

import { parseSnsTld } from "./tld";

const isCanonicalLowercase = (domain: string) =>
  domain.trim().toLowerCase() === domain;

/**
 * Parses a top-level `.sns` domain and returns the raw domain label.
 */
export const _parseSnsTopLevelDomain = (domain: string): string => {
  const [trimmedDomain] = parseSnsTld(domain);

  if (
    !trimmedDomain ||
    trimmedDomain.includes(".") ||
    !isCanonicalLowercase(trimmedDomain)
  ) {
    throw new InvalidDomainError("The domain name is malformed");
  }

  return trimmedDomain;
};

/**
 * Parses a `.sns` subdomain and returns `[subdomainLabel, parentLabel]`.
 */
export const _parseSnsSubdomain = (subdomain: string): [string, string] => {
  const [trimmedSubdomain] = parseSnsTld(subdomain);
  const labels = trimmedSubdomain.split(".");
  const [sub, parent] = labels;

  if (
    labels.length !== 2 ||
    !sub ||
    !parent ||
    !isCanonicalLowercase(trimmedSubdomain)
  ) {
    throw new InvalidSubdomainError("The subdomain name is malformed");
  }

  return [sub, parent];
};

/**
 * Parses a canonical `.sns` top-level domain or one-level subdomain and returns
 * the TLD-trimmed name.
 */
export const _parseSnsDomain = (domain: string): string => {
  const [trimmedDomain] = parseSnsTld(domain);
  const labels = trimmedDomain.split(".");

  if (
    labels.length > 2 ||
    labels.some((label) => !label) ||
    !isCanonicalLowercase(trimmedDomain)
  ) {
    throw new InvalidDomainError("The domain name is malformed");
  }

  return trimmedDomain;
};
