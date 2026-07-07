import {
  createAssociatedTokenAccountIdempotentInstruction,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";

import {
  CENTRAL_STATE,
  NAME_PROGRAM_ID,
  PYTH_PULL_FEEDS,
  REFERRERS,
  REGISTER_PROGRAM_ID,
  SNS_ROOT_DOMAIN_ACCOUNT,
  USDC_MINT,
  VAULT_OWNER,
} from "../constants";
import { PythFeedNotFoundError } from "../error";
import { CreateSplitV2Instruction } from "../instructions/createSplitV2Instruction";
import { getHashedNameSync } from "../utils/getHashedNameSync";
import { getNameAccountKeySync } from "../utils/getNameAccountKeySync";
import { getPythFeedAccountKey } from "../utils/getPythFeedAccountKey";
import { _parseSnsTopLevelDomain } from "../utils/parseSnsDomain";

/**
 * Builds the instructions to register a top-level `.sns` domain.
 *
 * If a supported referrer is provided and its token account does not exist,
 * the returned instructions include an idempotent associated token account
 * creation instruction before the registration instruction.
 *
 * @param domain Full `.sns` domain name
 * @param space The number of bytes to allocate for the domain name account
 * @param buyer Buyer paying for the registration
 * @param buyerTokenAccount The buyer's token account used to pay for registration
 * @param mint The token mint used for payment, defaults to USDC
 * @param referrerKey Optional public key of the referrer
 * @returns Transaction instructions.
 */
export const registerDomain = async (
  domain: string,
  space: number,
  buyer: PublicKey,
  buyerTokenAccount: PublicKey,
  mint = USDC_MINT,
  referrerKey?: PublicKey,
) => {
  const trimmedDomain = _parseSnsTopLevelDomain(domain);

  const hashed = getHashedNameSync(trimmedDomain);
  const nameAccount = getNameAccountKeySync(
    hashed,
    undefined,
    SNS_ROOT_DOMAIN_ACCOUNT,
  );

  const hashedReverseLookup = getHashedNameSync(nameAccount.toBase58());
  const reverseLookupAccount = getNameAccountKeySync(
    hashedReverseLookup,
    CENTRAL_STATE,
  );

  const [derived_state] = PublicKey.findProgramAddressSync(
    [nameAccount.toBuffer()],
    REGISTER_PROGRAM_ID,
  );

  const refIdx = REFERRERS.findIndex((e) => referrerKey?.equals(e));
  let refTokenAccount: PublicKey | undefined = undefined;

  const ixs: TransactionInstruction[] = [];

  if (refIdx !== -1 && !!referrerKey) {
    refTokenAccount = getAssociatedTokenAddressSync(mint, referrerKey, true);
    const ix = createAssociatedTokenAccountIdempotentInstruction(
      buyer,
      refTokenAccount,
      referrerKey,
      mint,
    );
    ixs.push(ix);
  }

  const vault = getAssociatedTokenAddressSync(mint, VAULT_OWNER, true);
  const pythFeed = PYTH_PULL_FEEDS.get(mint.toBase58());

  if (!pythFeed) {
    throw new PythFeedNotFoundError(
      "The Pyth account for the provided mint was not found",
    );
  }

  const [pythFeedAccount] = getPythFeedAccountKey(0, pythFeed);

  const ix = new CreateSplitV2Instruction({
    name: trimmedDomain,
    space,
    referrerIdxOpt: refIdx != -1 ? refIdx : null,
  }).getInstruction(
    REGISTER_PROGRAM_ID,
    NAME_PROGRAM_ID,
    SNS_ROOT_DOMAIN_ACCOUNT,
    nameAccount,
    reverseLookupAccount,
    SystemProgram.programId,
    CENTRAL_STATE,
    buyer,
    buyer,
    buyer,
    buyerTokenAccount,
    pythFeedAccount,
    vault,
    TOKEN_PROGRAM_ID,
    SYSVAR_RENT_PUBKEY,
    derived_state,
    refTokenAccount,
  );
  ixs.push(ix);

  return ixs;
};
