import { getProgramDerivedAddress } from "@solana/kit";

import { addressCodec, utf8Codec } from "../codecs";
import {
  SOL_REGISTRAR_PROGRAM_ADDRESS,
  SRS_HASH_PREFIX,
  SRS_PROGRAM_ADDRESS,
} from "../config";

interface GetSrsDomainAddressParams {
  domain: string;
}

/**
 * Derives the canonical SRS record address for a TLD-trimmed `.sol` name.
 *
 * @param params Derivation parameters
 * @param params.domain TLD-trimmed `.sol` name
 * @returns The SRS record address and canonical name hash.
 */
export const getSrsDomainAddress = async ({
  domain,
}: GetSrsDomainAddressParams) => {
  const [centralState] = await getProgramDerivedAddress({
    programAddress: SOL_REGISTRAR_PROGRAM_ADDRESS,
    seeds: [utf8Codec.encode("central_state")],
  });
  const [solClass] = await getProgramDerivedAddress({
    programAddress: SRS_PROGRAM_ADDRESS,
    seeds: [
      utf8Codec.encode("class"),
      addressCodec.encode(centralState),
      utf8Codec.encode(".sol"),
    ],
  });
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
      addressCodec.encode(solClass),
      hashed,
    ],
  });

  return { domainAddress, hashed };
};
