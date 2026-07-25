/**
 * Verified SNS record queries and their public result types.
 * @module useRecords
 */
import {
  getMultipleRecords,
  type Record,
  type RecordResult,
} from "@bonfida/spl-name-service/record";
import type { Connection } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

import type { Options } from "../../types";

/** A record result that passed all applicable verification checks. */
export type VerifiedRecordResult = RecordResult | undefined;

/**
 * Options for {@link useRecords}.
 *
 * @example
 * ```ts
 * const options: UseRecordsOptions = { deserialize: true };
 * ```
 */
export interface UseRecordsOptions {
  /** Whether to deserialize record content according to its SNS record type. */
  deserialize?: boolean;
}

const isVerified = (result: RecordResult) =>
  result.verified.staleness && result.verified.roa !== false;

/**
 * Retrieves records and removes entries that fail verification.
 *
 * The output preserves the order of `records`. Missing records, stale records,
 * and records that fail an applicable right-of-association check are returned
 * as `undefined`.
 *
 * @param connection Solana RPC connection
 * @param domain Full `.sns` or `.sol` domain name
 * @param records Record types to retrieve
 * @param deserialize Whether to deserialize record content
 * @returns Verified record results in the same order as `records`
 *
 * When used as a query function, rejected record retrieval is exposed through
 * the query result's `error` and `isError` fields.
 *
 * @example
 * ```ts
 * const records = await getVerifiedRecords(connection, "example.sns", [Record.Url]);
 * ```
 */
export const getVerifiedRecords = async (
  connection: Connection,
  domain: string,
  records: Record[],
  deserialize = false,
): Promise<VerifiedRecordResult[]> => {
  const results = await getMultipleRecords(connection, domain, records, {
    deserialize,
  });

  return results.map((result) =>
    result && isVerified(result) ? result : undefined,
  );
};

/**
 * Retrieves and verifies multiple records through React Query.
 *
 * @param connection Solana RPC connection
 * @param domain Full `.sns` or `.sol` domain name
 * @param records Record types to retrieve
 * @param options Optional JavaScript SDK record retrieval settings
 * @param queryOptions Optional React Query settings
 * @returns React Query result where `data` preserves the `records` order and
 * uses `undefined` for missing or unverified entries; `isPending` tracks the
 * initial request, while failures populate `error` and set `isError` without
 * throwing during render.
 *
 * Query failures are exposed through the result's `error` and `isError` fields.
 *
 * @example
 * ```tsx
 * const { data, isError } = useRecords(connection, "example.sns", [Record.Url]);
 * ```
 */
export const useRecords = <TData = VerifiedRecordResult[]>(
  connection: Connection,
  domain: string,
  records: Record[],
  { deserialize = false }: UseRecordsOptions = {},
  queryOptions: Options<VerifiedRecordResult[], TData> = {},
) =>
  useQuery({
    ...queryOptions,
    queryKey: queryOptions.queryKey ?? [
      "useRecords",
      connection.rpcEndpoint,
      domain,
      records,
      deserialize,
    ],
    queryFn: () => getVerifiedRecords(connection, domain, records, deserialize),
  });
