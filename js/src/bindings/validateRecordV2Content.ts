import { SNS_RECORDS_ID, validateSolanaSignature } from "@bonfida/sns-records";
import { PublicKey } from "@solana/web3.js";

import { NAME_PROGRAM_ID } from "../constants";
import { InvalidParentError } from "../error";
import { Record, RecordVersion } from "../types/record";
import { getDomainKeySync } from "../utils/getDomainKeySync";
import { parseSupportedTld, SNS_TLD } from "../utils/tld";

/**
 * Builds the instruction to validate a V2 record's content using a Solana
 * signature, proving that the record was set by the domain owner or an
 * authorised verifier.
 *
 * @param staleness When `true`, validates the staleness signature (proving the
 *   record content matches the current owner); when `false`, validates the
 *   Right of Association signature instead.
 * @param domain The full domain name including TLD (e.g. `"mydomain.sns"`)
 * @param record The record type to validate
 * @param owner The owner of the domain
 * @param payer The fee payer of the transaction
 * @param verifier The account whose signature is being verified
 * @returns A {@link TransactionInstruction} that validates the record content
 * @throws {InvalidParentError} When the parent domain account cannot be resolved
 */
export const validateRecordV2Content = (
  staleness: boolean,
  domain: string,
  record: Record,
  owner: PublicKey,
  payer: PublicKey,
  verifier: PublicKey,
) => {
  // Only allows .sns domains
  parseSupportedTld(domain, [SNS_TLD]);

  let { pubkey, parent, isSub } = getDomainKeySync(
    `${record}.${domain}`,
    RecordVersion.V2,
  );

  if (isSub) {
    parent = getDomainKeySync(domain).pubkey;
  }

  if (!parent) {
    throw new InvalidParentError("Parent could not be found");
  }

  const ix = validateSolanaSignature(
    payer,
    pubkey,
    parent,
    owner,
    verifier,
    NAME_PROGRAM_ID,
    staleness,
    SNS_RECORDS_ID,
  );
  return ix;
};
