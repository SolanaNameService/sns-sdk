export const stripKnownTld = (domain: string) =>
  domain.trim().replace(/\.(sns|sol)$/i, "");

export const toSnsDomain = (domain: string) => `${stripKnownTld(domain)}.sns`;

export const toSolDomain = (domain: string) => `${stripKnownTld(domain)}.sol`;

export const toCanonicalSnsDomain = (domain: string) =>
  `${stripKnownTld(domain).toLowerCase()}.sns`;
