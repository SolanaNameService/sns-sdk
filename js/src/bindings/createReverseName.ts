import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { createReverseInstruction } from "../instructions/createReverseInstruction";
import {
  NAME_PROGRAM_ID,
  SNS_ROOT_DOMAIN_ACCOUNT,
  REGISTER_PROGRAM_ID,
  CENTRAL_STATE,
} from "../constants";
import { getHashedNameSync } from "../utils/getHashedNameSync";
import { getNameAccountKeySync } from "../utils/getNameAccountKeySync";

/**
 * Builds the instruction to create an SNS reverse lookup account for an
 * already-derived name account.
 *
 * This is a low-level SNS registrar helper: it creates reverse lookup accounts
 * for SNS names only. It is not suffix-aware and does not derive `nameAccount`
 * from a `.sns` domain string. The `name` argument is stored as provided and is
 * not validated, so callers must ensure it matches the supplied SNS
 * `nameAccount`. For subdomains, pass the parent name account and parent owner
 * so the reverse lookup is derived in the parent namespace.
 *
 * @param nameAccount The pre-derived SNS name account the reverse lookup points to
 * @param name The raw reverse name to store without a TLD suffix
 * @param feePayer The account paying for reverse account creation
 * @param parentName Optional parent name account, required for subdomain reverse lookups
 * @param parentNameOwner Optional parent name owner, required when `parentName` is provided
 * @returns An array containing the reverse lookup creation instruction
 */
export const createReverseName = async (
  nameAccount: PublicKey,
  name: string,
  feePayer: PublicKey,
  parentName?: PublicKey,
  parentNameOwner?: PublicKey,
) => {
  let hashedReverseLookup = getHashedNameSync(nameAccount.toBase58());
  let reverseLookupAccount = getNameAccountKeySync(
    hashedReverseLookup,
    CENTRAL_STATE,
    parentName,
  );

  let initCentralStateInstruction = new createReverseInstruction({
    name,
  }).getInstruction(
    REGISTER_PROGRAM_ID,
    NAME_PROGRAM_ID,
    SNS_ROOT_DOMAIN_ACCOUNT,
    reverseLookupAccount,
    SystemProgram.programId,
    CENTRAL_STATE,
    feePayer,
    SYSVAR_RENT_PUBKEY,
    parentName,
    parentNameOwner,
  );

  let instructions = [initCentralStateInstruction];

  return instructions;
};
