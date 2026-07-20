// Proxy endpoints accept domain names without the final TLD suffix. Do not
// strip `.sns`/`.sol` from params: values like `a.sns` may be valid labels
// under another TLD, e.g. `a.sns.sol`.
// These helpers must only receive values parsed by a domain schema.
export const toSnsDomain = (domain: string) => `${domain}.sns`;

export const toSolDomain = (domain: string) => `${domain}.sol`;
