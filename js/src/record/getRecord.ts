import { Record as SnsRecord, Validation } from "@bonfida/sns-records";
import { Connection, PublicKey } from "@solana/web3.js";

import { NameRegistryState } from "../state";
import { Record } from "../types/record";
import { getDomainKeySync } from "../utils/getDomainKeySync";
import { ETH_ROA_RECORDS, GUARDIANS, SELF_SIGNED } from "./const";
import { deserializeRecordContent } from "./deserializeRecordContent";
import { getRecordV2Key } from "./getRecordV2Key";

interface GetRecordOptions {
  deserialize?: boolean;
}

export interface RecordResult {
  record: Record;
  retrievedRecord: SnsRecord;
  verified: {
    staleness: boolean;
    roa?: boolean;
  };
  deserializedContent?: string;
}

/**
 * Retrieves a record for a domain, verifies its staleness and right of
 * association, and optionally deserializes the record content.
 *
 * @param connection Solana RPC connection
 * @param domain Full `.sns` or `.sol` domain name
 * @param record Record type to retrieve
 * @param options Optional retrieval settings.
 * @param options.deserialize When `true`, deserializes the raw record content.
 * @returns The requested record, the raw SNS record account, verification
 * results, and optionally the deserialized content.
 */
export async function getRecord(
  connection: Connection,
  domain: string,
  record: Record,
  options: GetRecordOptions = {},
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
      deserializedContent: deserializeRecordContent(
        retrievedRecord.getContent(),
        record,
      ),
    }),
  };
}
