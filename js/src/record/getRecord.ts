import { Buffer } from "buffer";

import { Record as SnsRecord } from "@bonfida/sns-records";
import { Connection, PublicKey } from "@solana/web3.js";

import { NameRegistryState } from "../state";
import { Record } from "../types/record";
import { assertTldSupported } from "../utils/assertTldSupported";
import { getSnsDomainKeySync } from "../utils/getSnsDomainKeySync";
import { ETH_ROA_RECORDS, GUARDIANS, SELF_SIGNED, Validation } from "./const";
import { deserializeRecordContent } from "./deserializeRecordContent";
import { getRecordV2Key } from "./getRecordV2Key";

/**
 * Options controlling content decoding for {@link getRecord}.
 *
 * @example
 * ```ts
 * const options: GetRecordOptions = { deserialize: true };
 * ```
 */
export interface GetRecordOptions {
  /** Whether to deserialize the returned record content. */
  deserialize?: boolean;
}

/**
 * Result returned by {@link getRecord} and by defined entries from
 * {@link getMultipleRecords}.
 *
 * @example
 * ```ts
 * {
 *   record: Record.Url,
 *   retrievedRecord: retrievedUrlRecord,
 *   verified: {
 *     staleness: true,
 *     roa: true,
 *   },
 *   deserializedContent: "https://example.com",
 * }
 * ```
 */
export interface RecordResult {
  /** Record type requested by the caller. */
  record: Record;

  /** Raw V2 record account, including its header and encoded payload. */
  retrievedRecord: RetrievedRecord;

  /** Verification results for the current effective domain owner and record verifier. */
  verified: {
    /** Whether the staleness identifier and validation mode match the domain owner. */
    staleness: boolean;
    /**
     * Whether the Right of Association identifier matches the expected
     * self-signed or guardian verifier and the header declares the required
     * validation scheme. Omitted when the record type has no configured verifier.
     */
    roa?: boolean;
  };
  /**
   * Record payload decoded to its display string. Present only when the caller
   * sets `options.deserialize` to `true`.
   */
  deserializedContent?: string;
}

/**
 * Raw SNS record account data returned by the records program.
 * @example
 * ```ts
 * {
 *   header: {
 *     stalenessValidation: Validation.Solana,
 *     rightOfAssociationValidation: Validation.Solana,
 *     contentLength: 19,
 *   },
 *   data: Buffer.from("https://example.com"),
 * }
 * ```
 */
export interface RetrievedRecord {
  /** Record header containing validation modes and payload length. */
  header: {
    stalenessValidation: number;
    rightOfAssociationValidation: number;
    contentLength: number;
  };
  /** Complete encoded account data. */
  data: Buffer;

  /** Returns the record payload bytes. */
  getContent(): Buffer;

  /** Returns the public-key bytes used for staleness validation. */
  getStalenessId(): Buffer;

  /** Returns the identifier bytes used for right-of-association validation. */
  getRoAId(): Buffer;
}

/**
 * Retrieves a record for a domain, verifies its staleness and right of
 * association, and optionally deserializes the record content.
 *
 * @param connection Solana RPC connection
 * @param domain Full `.sns` or `.sol` domain name
 * @param record Record type to retrieve
 * @param options Optional retrieval settings
 * @param options.deserialize Whether to deserialize the raw record content
 * @returns The requested record, verification results, and optional decoded content
 * @example
 * ```ts
 * const record = await getRecord(connection, "name.sns", Record.Url, {
 *   deserialize: true,
 * });
 * ```
 */
export async function getRecord(
  connection: Connection,
  domain: string,
  record: Record,
  options: GetRecordOptions = {},
): Promise<RecordResult> {
  const [trimmedDomain] = await assertTldSupported(connection, domain);
  const pubkey = getRecordV2Key(trimmedDomain, record);

  const [{ registry, nftOwner }, retrievedRecord] = await Promise.all([
    NameRegistryState.retrieve(
      connection,
      getSnsDomainKeySync(trimmedDomain).pubkey,
    ),
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
