// Proxy endpoints accept domain names without the final TLD suffix. Do not
// strip `.sns`/`.sol` from params: values like `a.sns` may be valid labels
// under another TLD, e.g. `a.sns.sol`.
const normalizeDomainParam = (domain: string) => domain.trim();

export const toSnsDomain = (domain: string) =>
  `${normalizeDomainParam(domain)}.sns`;

export const toSolDomain = (domain: string) =>
  `${normalizeDomainParam(domain)}.sol`;

export const toCanonicalSnsDomain = (domain: string) =>
  `${normalizeDomainParam(domain).toLowerCase()}.sns`;
