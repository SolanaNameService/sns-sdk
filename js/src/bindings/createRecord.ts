import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";

import { NAME_PROGRAM_ID } from "../constants";
import { UnsupportedRecordError } from "../error";
import { createInstruction } from "../instructions/createInstruction";
import { Numberu32, Numberu64 } from "../int";
import { serializeRecord } from "../record/serializeRecord";
import { NameRegistryState } from "../state";
import { Record, RecordVersion } from "../types/record";
import { check } from "../utils/check";
import { getDomainKeySync } from "../utils/getDomainKeySync";
import { _parseSnsDomain } from "../utils/parseSnsDomain";

/**
 * This function can be used be create a record V1, it handles the serialization of the record data
 * To create a SOL record use `createSolRecordInstruction`
 * @param connection The Solana RPC connection object
 * @param domain The full domain name including TLD (e.g. `domain.sns`)
 * @param record The record enum object
 * @param data The data (as a UTF-8 string) to store in the record account
 * @param owner The owner of the domain
 * @param payer The fee payer of the transaction
 * @returns
 */
export const createRecord = async (
  connection: Connection,
  domain: string,
  record: Record,
  data: string,
  owner: PublicKey,
  payer: PublicKey,
) => {
  check(
    record !== Record.SOL,
    new UnsupportedRecordError(
      "SOL record is not supported for this instruction",
    ),
  );

  _parseSnsDomain(domain);

  const { pubkey, hashed, parent } = getDomainKeySync(
    `${record}.${domain}`,
    RecordVersion.V1,
  );

  const serialized = serializeRecord(data, record);
  const space = serialized.length;
  const lamports = await connection.getMinimumBalanceForRentExemption(
    space + NameRegistryState.HEADER_LEN,
  );

  const ix = createInstruction(
    NAME_PROGRAM_ID,
    SystemProgram.programId,
    pubkey,
    owner,
    payer,
    hashed,
    new Numberu64(lamports),
    new Numberu32(space),
    undefined,
    parent,
    owner,
  );

  return ix;
};
