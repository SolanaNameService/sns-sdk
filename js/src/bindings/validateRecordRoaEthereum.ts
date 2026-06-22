import { Buffer } from "buffer";

import {
  SNS_RECORDS_ID,
  validateEthSignature,
  Validation,
} from "@bonfida/sns-records";
import { PublicKey } from "@solana/web3.js";

import { NAME_PROGRAM_ID } from "../constants";
import { Record } from "../types/record";
import { parseSupportedTld, SNS_TLD } from "../utils/tld";
import { _getRecordAndParentKey } from "./recordValidation";

/**
 * Validates the Right of Association of a .sns V2 record using an Ethereum signature.
 *
 * @param domain The full domain name including TLD (e.g. `"mydomain.sns"`)
 * @param record The record type to validate
 * @param owner The owner of the domain
 * @param payer The fee payer of the transaction
 * @param signature The 64-byte Ethereum signature used for validation
 * @param expectedPubkey The 20-byte Ethereum public key expected to match the signature
 * @returns A transaction instruction that validates the Ethereum signature
 */
export const validateRecordRoaEthereum = (
  domain: string,
  record: Record,
  owner: PublicKey,
  payer: PublicKey,
  signature: Buffer,
  expectedPubkey: Buffer,
) => {
  parseSupportedTld(domain, [SNS_TLD]);

  const { pubkey, parent } = _getRecordAndParentKey({ domain, record });

  return validateEthSignature(
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
};
