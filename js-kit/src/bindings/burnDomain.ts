import { Address, Instruction, getProgramDerivedAddress } from "@solana/kit";

import { addressCodec } from "../codecs";
import {
  NAME_PROGRAM_ADDRESS,
  REGISTRY_PROGRAM_ADDRESS,
  REVERSE_LOOKUP_CLASS,
  SYSTEM_PROGRAM_ADDRESS,
} from "../constants/addresses";
import { getSnsDomainAddress } from "../domain/getSnsDomainAddress";
import { BurnDomainInstruction } from "../instructions/burnDomainInstruction";
import { getReverseAddress } from "../utils/getReverseAddress";
import { _parseSnsTopLevelDomain } from "../utils/parseSnsDomain";

/**
 * Parameters for burning an SNS domain.
 *
 * @example
 * ```ts
 * const params: BurnDomainParams = {
 *   domain: "example.sns",
 *   owner,
 *   refundAddress,
 * };
 * ```
 */
export interface BurnDomainParams {
  /** Full `.sns` domain name. */
  domain: string;
  /** Current domain owner. */
  owner: Address;
  /** Account receiving reclaimed rent. */
  refundAddress: Address;
}

/**
 * Builds an instruction to burn a top-level `.sns` domain.
 *
 * @param params Burn parameters
 * @param params.domain Full `.sns` domain name
 * @param params.owner Current owner of the domain
 * @param params.refundAddress Account receiving reclaimed rent
 * @returns Transaction instruction.
 *
 * @example
 * ```ts
 * const instruction = await burnDomain({ domain: "example.sns", owner, refundAddress });
 * ```
 */
export const burnDomain = async ({
  domain,
  owner,
  refundAddress,
}: BurnDomainParams): Promise<Instruction> => {
  const trimmedDomain = _parseSnsTopLevelDomain(domain);

  const { domainAddress } = await getSnsDomainAddress({
    domain: trimmedDomain,
  });
  const encoded = addressCodec.encode(domainAddress);

  const [pda] = await getProgramDerivedAddress({
    programAddress: REGISTRY_PROGRAM_ADDRESS,
    seeds: [encoded],
  });

  const [resellingPda] = await getProgramDerivedAddress({
    programAddress: REGISTRY_PROGRAM_ADDRESS,
    seeds: [encoded, Uint8Array.from([1, 1])],
  });

  const reverseAddress = await getReverseAddress(trimmedDomain);

  const ix = new BurnDomainInstruction().getInstruction(
    REGISTRY_PROGRAM_ADDRESS,
    NAME_PROGRAM_ADDRESS,
    SYSTEM_PROGRAM_ADDRESS,
    domainAddress,
    reverseAddress,
    resellingPda,
    pda,
    REVERSE_LOOKUP_CLASS,
    owner,
    refundAddress
  );

  return ix;
};
