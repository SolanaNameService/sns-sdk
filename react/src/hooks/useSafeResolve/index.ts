/**
 * Safe domain resolution through TanStack Query.
 * @module useSafeResolve
 */
import { useQuery } from "@tanstack/react-query";
import { safeResolve } from "@bonfida/spl-name-service/domain";
import type { Connection, PublicKey } from "@solana/web3.js";
import type { Options } from "../../types";

/**
 * Resolves a `.sns` or `.sol` domain through the JavaScript SDK's `safeResolve`.
 * When SRS-backed `.sol` resolution is enabled, the `.sol` target and its
 * corresponding `.sns` target must match.
 *
 * @param connection Solana RPC connection
 * @param domain Full `.sns` or `.sol` domain name, or a nullish value to disable the automatic query
 * @param options Optional React Query settings
 * @returns React Query result where `data` is the resolved `PublicKey` unless
 * transformed by `select`; failures populate `error` and set `isError` without
 * throwing during render.
 *
 * @example
 * ```tsx
 * const { data: address } = useSafeResolve(connection, "example.sns");
 * ```
 */
export const useSafeResolve = <TData = PublicKey>(
  connection: Connection,
  domain: string | null | undefined,
  options: Options<PublicKey, TData> = {},
) => {
  return useQuery({
    ...options,
    queryKey: options.queryKey ?? [
      "useSafeResolve",
      connection.rpcEndpoint,
      domain,
    ],
    enabled: domain ? options.enabled : false,
    queryFn: () => {
      if (!domain) throw new Error("Domain is required");
      return safeResolve(connection, domain);
    },
  });
};
