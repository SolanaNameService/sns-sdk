import { Address, getProgramDerivedAddress } from "@solana/kit";

import { addressCodec, utf8Codec } from "../codecs";
import { SOL_SRS_CLASS, SRS_PROGRAM_ADDRESS } from "../constants/addresses";
import { SRS_HASH_PREFIX } from "../constants/srs";

/**
 * Parameters for deriving an SRS `.sol` domain address.
 *
 * @example
 * ```ts
 * const params: GetSolDomainAddressParams = { domain: "example" };
 * ```
 */
export interface GetSolDomainAddressParams {
  /** TLD-trimmed `.sol` domain name. */
  domain: string;
}

/**
 * A derived SRS `.sol` domain address and canonical name hash.
 *
 * @example
 * ```ts
 * const derived: GetSolDomainAddressResult = { domainAddress, hashed };
 * ```
 */
export interface GetSolDomainAddressResult {
  /** Derived SRS record address. */
  domainAddress: Address;
  /** SHA-256 hash of the canonical name. */
  hashed: Uint8Array;
}

/**
 * Derives the canonical SRS record address for a TLD-trimmed `.sol` name.
 *
 * @param params Derivation parameters
 * @param params.domain TLD-trimmed `.sol` domain name
 * @returns The SRS record address and canonical name hash.
 *
 * @example
 * ```ts
 * const derived = await getSolDomainAddress({ domain: "example" });
 * ```
 */
export const getSolDomainAddress = async ({
  domain,
}: GetSolDomainAddressParams): Promise<GetSolDomainAddressResult> => {
  const hashed = new Uint8Array(
    await crypto.subtle.digest(
      "SHA-256",
      utf8Codec.encode(SRS_HASH_PREFIX + domain)
    )
  );
  const [domainAddress] = await getProgramDerivedAddress({
    programAddress: SRS_PROGRAM_ADDRESS,
    seeds: [
      utf8Codec.encode("record"),
      addressCodec.encode(SOL_SRS_CLASS),
      hashed,
    ],
  });

  return { domainAddress, hashed };
};
