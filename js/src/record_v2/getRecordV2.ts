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

interface RecordResult {
  record: Record;
  retrievedRecord: SnsRecord;
  verified: {
    staleness: boolean;
    roa?: boolean;
  };
  deserializedContent?: string;
}

/**
 * Retrieves a record V2 for a domain, verifies its staleness and right of
 * association, and optionally deserializes the record content.
 *
 * @param connection The Solana RPC connection object.
 * @param domain The `.sol` domain name that owns the record.
 * @param record The record type to retrieve.
 * @param options Optional retrieval settings.
 * @param options.deserialize When `true`, deserializes the raw record content.
 * @returns The requested record, the raw SNS record account, verification
 * results, and optionally the deserialized content.
 */
export async function getRecordV2(
  connection: Connection,
  domain: string,
  record: Record,
  options: GetRecordV2Options = {},
): Promise<RecordResult> {
  const pubkey = getRecordV2Key(domain, record);

  const [{ registry, nftOwner }, retrievedRecord] = await Promise.all([
    NameRegistryState.retrieve(connection, getDomainKeySync(domain).pubkey),
    SnsRecord.retrieve(connection, pubkey),
  ]);

  const owner = nftOwner || registry.owner;
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
}
