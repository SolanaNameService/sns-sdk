import { SNS_RECORDS_ID, writeRoa } from "@bonfida/sns-records";
import { PublicKey } from "@solana/web3.js";

import { NAME_PROGRAM_ID } from "../constants";
import { Record } from "../types/record";
import { _parseSnsDomain } from "../utils/parseSnsDomain";
import { _getRecordAndParentKey } from "./recordValidation";

/**
 * Builds an instruction to store the expected Right of Association verifier.
 *
 * @param domain Full `.sns` domain or subdomain name
 * @param record Record type
 * @param owner Current owner of the domain
 * @param payer Fee payer for the instruction
 * @param verifier Verifier account used by the record validation instruction
 * @returns Transaction instruction.
 */
export const setRecordRoaVerifier = (
  domain: string,
  record: Record,
  owner: PublicKey,
  payer: PublicKey,
  verifier: PublicKey,
) => {
  const trimmedDomain = _parseSnsDomain(domain);

  const { pubkey, parent } = _getRecordAndParentKey({
    domain: trimmedDomain,
    record,
  });

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
