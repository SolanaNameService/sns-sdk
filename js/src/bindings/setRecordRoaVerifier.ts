import { SNS_RECORDS_ID, writeRoa } from "@bonfida/sns-records";
import { PublicKey } from "@solana/web3.js";

import { NAME_PROGRAM_ID } from "../constants";
import { Record } from "../types/record";
import { _parseSnsDomain } from "../utils/parseSnsDomain";
import { _getRecordAndParentKey } from "./recordValidation";

/**
 * Stores the expected Right of Association verifier for a .sns record.
 *
 * @param domain The full domain name including TLD (e.g. `"mydomain.sns"`)
 * @param record The record type to set the RoA verifier for
 * @param owner The owner of the domain
 * @param payer The fee payer of the transaction
 * @param verifier The expected RoA verifier to store in the record
 * @returns A transaction instruction that sets the RoA verifier
 */
export const setRecordRoaVerifier = (
  domain: string,
  record: Record,
  owner: PublicKey,
  payer: PublicKey,
  verifier: PublicKey,
) => {
  _parseSnsDomain(domain);

  const { pubkey, parent } = _getRecordAndParentKey({ domain, record });

  return writeRoa(
    payer,
    NAME_PROGRAM_ID,
    pubkey,
    parent,
    owner,
    verifier,
    SNS_RECORDS_ID,
  );
};
