import { Buffer } from "buffer";

import {
  SNS_RECORDS_ID,
  validateEthSignature,
  Validation,
} from "@bonfida/sns-records";
import { PublicKey } from "@solana/web3.js";

import { NAME_PROGRAM_ID } from "../constants";
import { Record } from "../types/record";
import { _parseSnsDomain } from "../utils/parseSnsDomain";
import { _getRecordAndParentKey } from "./recordValidation";

/**
 * Builds an instruction to validate a record's Right of Association with an Ethereum signature.
 *
 * @param domain Full `.sns` domain or subdomain name
 * @param record Record type
 * @param owner Current owner of the domain
 * @param payer Fee payer for the instruction
 * @param signature The 64-byte Ethereum signature used for validation
 * @param expectedPubkey The 20-byte Ethereum public key expected to match the signature
 * @returns Transaction instruction.
 */
export const validateRecordRoaEthereum = (
  domain: string,
  record: Record,
  owner: PublicKey,
  payer: PublicKey,
  signature: Buffer,
  expectedPubkey: Buffer,
) => {
  const trimmedDomain = _parseSnsDomain(domain);

  const { pubkey, parent } = _getRecordAndParentKey({
    domain: trimmedDomain,
    record,
  });

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
