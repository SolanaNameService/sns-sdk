import {
  ASSOCIATED_TOKEN_PROGRAM_ADDRESS,
  findAssociatedTokenPda,
} from "@solana-program/token";
import { Address, Instruction, getProgramDerivedAddress } from "@solana/kit";

import { addressCodec } from "../codecs";
import {
  CENTRAL_STATE,
  NAME_PROGRAM_ADDRESS,
  REFERRERS,
  REGISTRY_PROGRAM_ADDRESS,
  SNS_ROOT_DOMAIN_ACCOUNT,
  SYSTEM_PROGRAM_ADDRESS,
  SYSVAR_RENT_ADDRESS,
  TOKEN_PROGRAM_ADDRESS,
  USDC_MINT,
  VAULT_OWNER,
} from "../constants/addresses";
import { PYTH_FEEDS } from "../constants/pythFeeds";
import { PythFeedNotFoundError } from "../errors";
import { _createAtaIdempotentInstruction } from "../instructions/createAtaIdempotentInstruction";
import { CreateSplitV2Instruction } from "../instructions/createSplitV2Instruction";
import { _deriveAddress } from "../utils/deriveAddress";
import { getPythFeedAddress } from "../utils/getPythFeedAddress";
import { _parseSnsTopLevelDomain } from "../utils/parseSnsDomain";

/**
 * Parameters for registering an SNS domain.
 *
 * @example
 * ```ts
 * const params: RegisterDomainParams = {
 *   domain: "example.sns",
 *   space: 1_000,
 *   buyer,
 *   buyerTokenAccount,
 * };
 * ```
 */
export interface RegisterDomainParams {
  /** Full `.sns` domain name. */
  domain: string;
  /** Domain registry size in bytes. */
  space: number;
  /** Account paying for registration. */
  buyer: Address;
  /** Buyer's payment token account. */
  buyerTokenAccount: Address;
  /** Payment token mint. Defaults to USDC. */
  mint?: Address;
  /** Supported referrer address. */
  referrer?: Address;
}

/**
 * Builds the instructions to register a top-level `.sns` domain.
 *
 * If a supported referrer is provided, the returned instructions include an
 * idempotent associated token account creation instruction before the
 * registration instruction.
 *
 * @param params Registration parameters
 * @param params.domain Full `.sns` domain name
 * @param params.space Number of bytes to allocate for the domain registry
 * @param params.buyer Buyer paying for the registration
 * @param params.buyerTokenAccount Buyer's token account used to pay for registration
 * @param params.mint Token mint used for payment. Defaults to USDC
 * @param params.referrer Optional referrer address
 * @returns Transaction instructions.
 *
 * @example
 * ```ts
 * const instructions = await registerDomain({
 *   domain: "example.sns",
 *   space: 1_000,
 *   buyer,
 *   buyerTokenAccount,
 * });
 * ```
 */
export const registerDomain = async ({
  domain,
  space,
  buyer,
  buyerTokenAccount,
  mint = USDC_MINT,
  referrer,
}: RegisterDomainParams): Promise<Instruction[]> => {
  domain = _parseSnsTopLevelDomain(domain);

  const domainAddress = await _deriveAddress(domain, SNS_ROOT_DOMAIN_ACCOUNT);

  const reverseLookupAccount = await _deriveAddress(
    domainAddress,
    undefined,
    CENTRAL_STATE
  );

  const [stateAddress] = await getProgramDerivedAddress({
    programAddress: REGISTRY_PROGRAM_ADDRESS,
    seeds: [addressCodec.encode(domainAddress)],
  });

  const ixs: Instruction[] = [];
  const referrerIndex = REFERRERS.findIndex((e) => e === referrer);
  const validReferrer = referrer && referrerIndex !== -1;
  let ata: Address | undefined = undefined;

  if (validReferrer) {
    [ata] = await findAssociatedTokenPda({
      mint,
      owner: referrer,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });
    const ix = _createAtaIdempotentInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ADDRESS,
      buyer,
      ata,
      referrer,
      mint,
      SYSTEM_PROGRAM_ADDRESS,
      TOKEN_PROGRAM_ADDRESS
    );

    ixs.push(ix);
  }

  const [vaultAta] = await findAssociatedTokenPda({
    mint,
    owner: VAULT_OWNER,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });
  const priceFeed = PYTH_FEEDS.get(mint);

  if (!priceFeed) {
    throw new PythFeedNotFoundError(
      "The Pyth account for the provided mint was not found"
    );
  }

  const pythFeedAddress = await getPythFeedAddress({
    shard: 0,
    priceFeed,
  });

  const ix = new CreateSplitV2Instruction({
    name: domain,
    space,
    referrerIdxOpt: validReferrer ? referrerIndex : null,
  }).getInstruction(
    REGISTRY_PROGRAM_ADDRESS,
    NAME_PROGRAM_ADDRESS,
    SNS_ROOT_DOMAIN_ACCOUNT,
    domainAddress,
    reverseLookupAccount,
    SYSTEM_PROGRAM_ADDRESS,
    CENTRAL_STATE,
    buyer,
    buyer,
    buyer,
    buyerTokenAccount,
    pythFeedAddress,
    vaultAta,
    TOKEN_PROGRAM_ADDRESS,
    SYSVAR_RENT_ADDRESS,
    stateAddress,
    ata
  );
  ixs.push(ix);

  return ixs;
};
