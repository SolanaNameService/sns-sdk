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
import { CreateWithNftInstruction } from "../instructions/createWithNftInstruction";
import { _deriveAddress } from "../utils/deriveAddress";
import { _parseSnsTopLevelDomain } from "../utils/parseSnsDomain";

/**
 * Parameters for registering an SNS domain with an NFT.
 *
 * @example
 * ```ts
 * const params: RegisterDomainWithNftParams = {
 *   domain: "example.sns",
 *   space: 1_000,
 *   buyer,
 *   nftSource,
 *   nftMint,
 * };
 * ```
 */
export interface RegisterDomainWithNftParams {
  /** Full `.sns` domain name. */
  domain: string;
  /** Domain registry size in bytes. */
  space: number;
  /** Account registering the domain. */
  buyer: Address;
  /** Source token account for the NFT. */
  nftSource: Address;
  /** Bonfida Wolves NFT mint. */
  nftMint: Address;
}

/**
 * Builds an instruction to register a top-level `.sns` domain using a Bonfida Wolves NFT.
 *
 * @param params Registration parameters
 * @param params.domain Full `.sns` domain name
 * @param params.space Number of bytes to allocate for the domain registry
 * @param params.buyer Buyer paying for the registration
 * @param params.nftSource NFT source account
 * @param params.nftMint NFT mint used for registration
 * @returns Transaction instruction.
 *
 * @example
 * ```ts
 * const instruction = await registerDomainWithNft({
 *   domain: "example.sns",
 *   space: 1_000,
 *   buyer,
 *   nftSource,
 *   nftMint,
 * });
 * ```
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

  const ix = new CreateWithNftInstruction({
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
