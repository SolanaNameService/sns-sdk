import { Address, Instruction, getProgramDerivedAddress } from "@solana/kit";

import { addressCodec } from "../codecs";
import {
  NAME_PROGRAM_ADDRESS,
  REGISTRY_PROGRAM_ADDRESS,
  REVERSE_LOOKUP_CLASS,
  SYSTEM_PROGRAM_ADDRESS,
} from "../constants/addresses";
import { getDomainAddress } from "../domain/getDomainAddress";
import { BurnDomainInstruction } from "../instructions/burnDomainInstruction";
import { getReverseAddress } from "../utils/getReverseAddress";
import { _parseSnsTopLevelDomain } from "../utils/parseSnsDomain";

interface BurnDomainParams {
  domain: string;
  owner: Address;
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
 */
export const burnDomain = async ({
  domain,
  owner,
  refundAddress,
}: BurnDomainParams): Promise<Instruction> => {
  _parseSnsTopLevelDomain(domain);

  const { domainAddress } = await getDomainAddress({ domain });
  const encoded = addressCodec.encode(domainAddress);

  const [pda] = await getProgramDerivedAddress({
    programAddress: REGISTRY_PROGRAM_ADDRESS,
    seeds: [encoded],
  });

  const [resellingPda] = await getProgramDerivedAddress({
    programAddress: REGISTRY_PROGRAM_ADDRESS,
    seeds: [encoded, Uint8Array.from([1, 1])],
  });

  const reverseAddress = await getReverseAddress(domain);

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
