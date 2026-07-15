import { Record as SnsRecord, Validation } from "@bonfida/sns-records";
import { Connection, PublicKey } from "@solana/web3.js";

import { NameRegistryState } from "../state";
import { Record } from "../types/record";
import { assertMainnetDomainSupported } from "../utils/assertMainnetDomainSupported";
import { getDomainKeySync } from "../utils/getDomainKeySync";
import { ETH_ROA_RECORDS, GUARDIANS, SELF_SIGNED } from "./const";
import { deserializeRecordContent } from "./deserializeRecordContent";
import { getRecordV2Key } from "./getRecordV2Key";

import type { RecordResult } from "./getRecord";

interface GetMultipleRecordsOptions {
  deserialize?: boolean;
}

/**
 * Retrieves multiple records for a domain, verifies the staleness and right
 * of association of each, and optionally deserializes their content.
 *
 * @param connection Solana RPC connection
 * @param domain Full `.sns` or `.sol` domain name
 * @param records Record types to retrieve
 * @param options Optional retrieval settings.
 * @param options.deserialize When `true`, deserializes the raw content of each record.
 * @returns An array of results in the same order as `records`. Each entry
 * contains the record type, the raw SNS record account, staleness and
 * right-of-association verification results, and optionally the deserialized
 * content. Entries are `undefined` for records that do not exist on-chain.
 */
export async function getMultipleRecords(
  connection: Connection,
  domain: string,
  records: Record[],
  options: GetMultipleRecordsOptions = {},
): Promise<(RecordResult | undefined)[]> {
  await assertMainnetDomainSupported(connection, domain);
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
        deserializedContent: deserializeRecordContent(
          retrievedRecord.getContent(),
          record,
        ),
      }),
    };
  });
}
