import { Address, Instruction, getProgramDerivedAddress } from "@solana/kit";

import { addressCodec, utf8Codec } from "../codecs";
import {
  CENTRAL_STATE,
  METAPLEX_PROGRAM_ADDRESS,
  NAME_PROGRAM_ADDRESS,
  REGISTRY_PROGRAM_ADDRESS,
  REVERSE_LOOKUP_CLASS,
  SNS_ROOT_DOMAIN_ACCOUNT,
  SYSTEM_PROGRAM_ADDRESS,
  SYSVAR_RENT_ADDRESS,
  TOKEN_PROGRAM_ADDRESS,
  WOLVES_COLLECTION_METADATA,
} from "../constants/addresses";
import { createWithNftInstruction } from "../instructions/createWithNftInstruction";
import { _deriveAddress } from "../utils/deriveAddress";
import { _parseSnsTopLevelDomain } from "../utils/parseSnsDomain";

interface RegisterDomainWithNftParams {
  domain: string;
  space: number;
  buyer: Address;
  nftSource: Address;
  nftMint: Address;
}

/**
 * Registers a .sns domain using a Bonfida Wolves NFT.
 *
 * @param params - An object containing the following properties:
 *   - `domain`: The full .sns domain name to be registered.
 *   - `space`: The space in bytes to be allocated for the domain registry.
 *   - `buyer`: The address of the buyer registering the domain.
 *   - `nftSource`: The address of the NFT source account.
 *   - `nftMint`: The mint address of the NFT used for registration.
 * @returns A promise which resolves to the register domain with NFT instruction.
 */
export const registerDomainWithNft = async ({
  domain,
  space,
  buyer,
  nftSource,
  nftMint,
}: RegisterDomainWithNftParams): Promise<Instruction> => {
  domain = _parseSnsTopLevelDomain(domain);

  const domainAddress = await _deriveAddress(domain, SNS_ROOT_DOMAIN_ACCOUNT);
  const reverseLookupAccount = await _deriveAddress(
    domainAddress,
    undefined,
    CENTRAL_STATE
  );

  const [state] = await getProgramDerivedAddress({
    programAddress: REGISTRY_PROGRAM_ADDRESS,
    seeds: [addressCodec.encode(domainAddress)],
  });
  const [nftMetadata] = await getProgramDerivedAddress({
    programAddress: METAPLEX_PROGRAM_ADDRESS,
    seeds: [
      utf8Codec.encode("metadata"),
      addressCodec.encode(METAPLEX_PROGRAM_ADDRESS),
      addressCodec.encode(nftMint),
    ],
  });
  const [masterEdition] = await getProgramDerivedAddress({
    programAddress: METAPLEX_PROGRAM_ADDRESS,
    seeds: [
      utf8Codec.encode("metadata"),
      addressCodec.encode(METAPLEX_PROGRAM_ADDRESS),
      addressCodec.encode(nftMint),
      utf8Codec.encode("edition"),
    ],
  });

  const ix = new createWithNftInstruction({
    space,
    name: domain,
  }).getInstruction(
    REGISTRY_PROGRAM_ADDRESS,
    NAME_PROGRAM_ADDRESS,
    SNS_ROOT_DOMAIN_ACCOUNT,
    domainAddress,
    reverseLookupAccount,
    SYSTEM_PROGRAM_ADDRESS,
    REVERSE_LOOKUP_CLASS,
    buyer,
    nftSource,
    nftMetadata,
    nftMint,
    masterEdition,
    WOLVES_COLLECTION_METADATA,
    TOKEN_PROGRAM_ADDRESS,
    SYSVAR_RENT_ADDRESS,
    state,
    METAPLEX_PROGRAM_ADDRESS
  );
  return ix;
};
