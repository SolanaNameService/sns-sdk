import { Address } from "@solana/kit";

import { SOL_SRS_RESOLUTION_ENABLED } from "../config";
import { UnsupportedTldError } from "../errors";
import { assertTldSupported } from "../utils/assertTldSupported";
import { SNS_TLD, SOL_TLD, parseSupportedTld } from "../utils/tld";
import { resolveSns } from "./resolveSns";
import { resolveSol } from "./resolveSol";
import { ResolveParams } from "./resolveTypes";

export type { ResolveOptions } from "./resolveTypes";

/**
 * Resolves a `.sns` or `.sol` domain to its target address.
 *
 * @param params Resolution parameters
 * @param params.rpc RPC client implementing account, multiple-account, token-largest-account, and slot APIs
 * @param params.domain Full domain name including a `.sns` or `.sol` suffix
 * @param params.options Optional PDA owner resolution options. Defaults to `{ allowPda: false }`
 * @returns The resolved target address.
 */
export const resolve = async ({
  rpc,
  domain,
  options = { allowPda: false },
}: ResolveParams): Promise<Address> => {
  if (domain.endsWith(SOL_TLD)) {
    const trimmedSolDomain = domain.slice(0, -SOL_TLD.length);

    if (SOL_SRS_RESOLUTION_ENABLED) {
      return resolveSol({ rpc, domain: trimmedSolDomain, options });
    }

    await assertTldSupported({ rpc, domain });
    return resolveSns({ rpc, domain: trimmedSolDomain, options });
  }

  const [trimmedDomain, tld] = parseSupportedTld(domain);
  if (tld === SNS_TLD) {
    return resolveSns({ rpc, domain: trimmedDomain, options });
  }

  throw new UnsupportedTldError(`Domain "${domain}" has an unsupported TLD`);
};
