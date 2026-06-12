import { Buffer } from "buffer";

import {
  SNS_RECORDS_ID,
  validateEthSignature,
  Validation,
} from "@bonfida/sns-records";
import { PublicKey } from "@solana/web3.js";

import { NAME_PROGRAM_ID } from "../constants";
import { InvalidParentError } from "../error";
import { Record, RecordVersion } from "../types/record";
import { getDomainKeySync } from "../utils/getDomainKeySync";
import { parseSupportedTld, SNS_TLD } from "../utils/tld";

/**
 * Builds the instruction to validate a V2 record's content using an Ethereum
 * signature, proving that the Ethereum address stored in the record is
 * controlled by the domain owner.
 *
 * @param domain The full domain name including TLD (e.g. `"mydomain.sns"`)
 * @param record The record type to validate
 * @param owner The owner of the domain
 * @param payer The fee payer of the transaction
 * @param signature The 64-byte Ethereum signature over the record content
 * @param expectedPubkey The 20-byte Ethereum public key expected to match the signature
 * @returns A {@link TransactionInstruction} that validates the Ethereum signature
 */
export const ethValidateRecordV2Content = (
  domain: string,
  record: Record,
  owner: PublicKey,
  payer: PublicKey,
  signature: Buffer,
  expectedPubkey: Buffer,
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

  const ix = validateEthSignature(
    payer,
    pubkey,
    parent,
    owner,
    NAME_PROGRAM_ID,
    Validation.Ethereum,
    signature,
    expectedPubkey,
    SNS_RECORDS_ID,
  );
  return ix;
};
