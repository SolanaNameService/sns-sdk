import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";

import {
  METAPLEX_ID,
  NAME_PROGRAM_ID,
  REGISTER_PROGRAM_ID,
  REVERSE_LOOKUP_CLASS,
  SNS_ROOT_DOMAIN_ACCOUNT,
  WOLVES_COLLECTION_METADATA,
} from "../constants";
import { CreateWithNftInstruction } from "../instructions/createWithNftInstruction";
import { _parseSnsTopLevelDomain } from "../utils/parseSnsDomain";

/**
 * Builds the instruction to register a `.sns` domain name using a Wolves
 * collection NFT in lieu of a token payment.
 *
 * The `nameAccount` and `reverseLookupAccount` keys must be pre-derived with
 * {@link getDomainKeySync} and {@link getReverseKeySync} respectively before
 * calling this function.
 *
 * @param domain The full domain name including TLD (e.g. `"mydomain.sns"`)
 * @param space The number of bytes to allocate for the name account data
 * @param nameAccount The derived public key of the domain name account
 * @param reverseLookupAccount The derived public key of the reverse lookup account
 * @param buyer The buyer's wallet — pays rent and must hold the NFT
 * @param nftSource The buyer's token account holding the Wolves NFT
 * @param nftMetadata The Metaplex metadata account for the NFT
 * @param nftMint The mint address of the Wolves NFT
 * @param masterEdition The Metaplex master edition account for the NFT
 * @returns A {@link TransactionInstruction} that registers the domain
 */
export const registerDomainWithNft = (
  domain: string,
  space: number,
  nameAccount: PublicKey,
  reverseLookupAccount: PublicKey,
  buyer: PublicKey,
  nftSource: PublicKey,
  nftMetadata: PublicKey,
  nftMint: PublicKey,
  masterEdition: PublicKey,
) => {
  const trimmedDomain = _parseSnsTopLevelDomain(domain);

  const [state] = PublicKey.findProgramAddressSync(
    [nameAccount.toBuffer()],
    REGISTER_PROGRAM_ID,
  );
  const ix = new CreateWithNftInstruction({
    space,
    name: trimmedDomain,
  }).getInstruction(
    REGISTER_PROGRAM_ID,
    NAME_PROGRAM_ID,
    SNS_ROOT_DOMAIN_ACCOUNT,
    nameAccount,
    reverseLookupAccount,
    SystemProgram.programId,
    REVERSE_LOOKUP_CLASS,
    buyer,
    nftSource,
    nftMetadata,
    nftMint,
    masterEdition,
    WOLVES_COLLECTION_METADATA,
    TOKEN_PROGRAM_ID,
    SYSVAR_RENT_PUBKEY,
    state,
    METAPLEX_ID,
  );
  return ix;
};
