import { Address, getProgramDerivedAddress } from "@solana/kit";

import { addressCodec, utf8Codec } from "../codecs";
import { SRS_HASH_PREFIX, SRS_PROGRAM_ADDRESS } from "../config";
import { SOL_SRS_CLASS } from "../constants/addresses";

/**
 * Parameters for deriving an SRS domain address.
 *
 * @example
 * ```ts
 * const params: GetSrsDomainAddressParams = { domain: "example" };
 * ```
 */
export interface GetSrsDomainAddressParams {
  /** TLD-less `.sol` domain name. */
  domain: string;
}

/**
 * A derived SRS domain address.
 *
 * @example
 * ```ts
 * const derived: GetSrsDomainAddressResult = { domainAddress, hashed };
 * ```
 */
export interface GetSrsDomainAddressResult {
  /** Derived SRS record address. */
  domainAddress: Address;
  /** SHA-256 hash of the canonical name. */
  hashed: Uint8Array;
}

/**
 * Derives the canonical SRS record address for a TLD-trimmed `.sol` name.
 *
 * @param params Derivation parameters
 * @param params.domain TLD-trimmed `.sol` name
 * @returns The SRS record address and canonical name hash.
 *
 * @example
 * ```ts
 * const derived = await getSrsDomainAddress({ domain: "example" });
 * ```
 */
export const getSrsDomainAddress = async ({
  domain,
}: GetSrsDomainAddressParams): Promise<GetSrsDomainAddressResult> => {
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
