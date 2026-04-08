import { Record } from "../types/record";
import { Connection, PublicKey } from "@solana/web3.js";
import { Record as SnsRecord, Validation } from "@bonfida/sns-records";

import { getRecordV2Key } from "./getRecordV2Key";
import { deserializeRecordV2Content } from "./deserializeRecordV2Content";
import { NameRegistryState } from "../state";
import { getDomainKeySync } from "../utils/getDomainKeySync";
import { ETH_ROA_RECORDS, GUARDIANS, SELF_SIGNED } from "./const";

interface GetRecordV2Options {
  deserialize?: boolean;
}

export interface RecordResult {
  retrievedRecord: SnsRecord;
  record: Record;
  verified: {
    staleness: boolean;
    roa?: boolean;
  };
  deserializedContent?: string;
}

/**
 * Retrieves multiple records V2 for a domain, verifies the staleness and right
 * of association of each, and optionally deserializes their content.
 *
 * @param connection The Solana RPC connection object.
 * @param domain The `.sol` domain name that owns the records.
 * @param records The list of record types to retrieve.
 * @param options Optional retrieval settings.
 * @param options.deserialize When `true`, deserializes the raw content of each record.
 * @returns An array of results in the same order as `records`. Each entry
 * contains the record type, the raw SNS record account, staleness and
 * right-of-association verification results, and optionally the deserialized
 * content. Entries are `undefined` for records that do not exist on-chain.
 */
export async function getMultipleRecordsV2(
  connection: Connection,
  domain: string,
  records: Record[],
  options: GetRecordV2Options = {},
): Promise<(RecordResult | undefined)[]> {
  const pubkeys = records.map((record) => getRecordV2Key(domain, record));

  const [{ registry, nftOwner }, retrievedRecords] = await Promise.all([
    NameRegistryState.retrieve(connection, getDomainKeySync(domain).pubkey),
    SnsRecord.retrieveBatch(connection, pubkeys),
  ]);

  const owner = nftOwner || registry.owner;

  return retrievedRecords.map((retrievedRecord, idx) => {
    if (!retrievedRecord) return undefined;

    const record = records[idx];
    const stalenessId = retrievedRecord.getStalenessId();
    const roaId = retrievedRecord.getRoAId();

    const validation = ETH_ROA_RECORDS.has(record)
      ? Validation.Ethereum
      : Validation.Solana;
    const verifier = SELF_SIGNED.has(record)
      ? retrievedRecord.getContent()
      : GUARDIANS.get(record)?.toBuffer();

    const verified = {
      staleness:
        owner.equals(new PublicKey(stalenessId)) &&
        retrievedRecord.header.stalenessValidation === Validation.Solana,
      ...(verifier !== undefined && {
        roa:
          verifier.compare(roaId) === 0 &&
          retrievedRecord.header.rightOfAssociationValidation === validation,
      }),
    };

    return {
      record,
      retrievedRecord,
      verified,
      ...(options.deserialize && {
        deserializedContent: deserializeRecordV2Content(
          retrievedRecord.getContent(),
          record,
        ),
      }),
    };
  });
}
