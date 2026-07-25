/**
 * Verified SNS profile-picture records through TanStack Query.
 * @module useProfilePic
 */
import { Record } from "@bonfida/spl-name-service/record";
import type { Connection } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

import type { Options } from "../../types";
import { getVerifiedRecords } from "../useRecords";

/**
 * Retrieves verified, deserialized profile-picture content through React Query.
 *
 * Stale records and records that fail an applicable right-of-association check
 * are rejected.
 *
 * @param connection Solana RPC connection
 * @param domain Full `.sns` or `.sol` domain name
 * @param options Optional React Query settings
 * @returns React Query result where `data` is profile-picture content or `null`
 * when no safe value exists; `isPending` tracks the initial request, while
 * failures populate `error` and set `isError` without throwing during render.
 *
 * Query failures are exposed through the result's `error` and `isError` fields.
 *
 * @example
 * ```tsx
 * const { data: profilePicture } = useProfilePic(connection, "example.sns");
 * ```
 */
export const useProfilePic = <TData = string | null>(
  connection: Connection,
  domain: string,
  options: Options<string | null, TData> = {},
) =>
  useQuery({
    ...options,
    queryKey: options.queryKey ?? [
      "useProfilePic",
      connection.rpcEndpoint,
      domain,
    ],
    queryFn: async () => {
      const [result] = await getVerifiedRecords(
        connection,
        domain,
        [Record.Pic],
        true,
      );
      return result?.deserializedContent ?? null;
    },
  });
