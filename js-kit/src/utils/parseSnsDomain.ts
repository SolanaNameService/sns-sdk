import { InvalidDomainError, InvalidSubdomainError } from "../errors";
import { parseSnsTld } from "./tld";

const isCanonicalLowercase = (domain: string) =>
  domain.trim().toLowerCase() === domain;

/**
 * Parses a top-level `.sns` domain and returns the raw domain label.
 *
 * @param domain Full lowercase top-level `.sns` domain name
 * @returns Raw domain label without the `.sns` suffix.
 * @throws InvalidDomainError If the domain is malformed.
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
 *
 * @param subdomain Full lowercase `.sns` subdomain name in `sub.parent.sns` form
 * @returns Subdomain label and parent label.
 * @throws InvalidSubdomainError If the subdomain is malformed.
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
 * Parses a writable `.sns` domain and allows either `name.sns` or
 * `sub.parent.sns`.
 *
 * @param domain Full lowercase `.sns` domain or subdomain name
 * @returns Domain name without the `.sns` suffix.
 * @throws InvalidDomainError If the domain is malformed.
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
