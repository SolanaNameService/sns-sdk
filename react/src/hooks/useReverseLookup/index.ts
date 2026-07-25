/**
 * Domain-account reverse lookup through TanStack Query.
 * @module useReverseLookup
 */
import type { Options } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { reverseLookup } from "@bonfida/spl-name-service/domain";
import type { Connection, PublicKey } from "@solana/web3.js";

/**
 * Performs a reverse lookup for a domain account through React Query.
 *
 * @param connection Solana RPC connection
 * @param pubkey Domain account public key, or a nullish value to disable the query
 * @param options Optional React Query settings
 * @returns React Query result where `data` is the human-readable domain name;
 * `isPending` tracks the initial request, while failures populate `error` and
 * set `isError` without throwing during render.
 *
 * Query failures are exposed through the result's `error` and `isError` fields.
 *
 * @example
 * ```tsx
 * const { data: domain } = useReverseLookup(connection, domainAccount);
 * ```
 */
export const useReverseLookup = <TData = string>(
  connection: Connection,
  pubkey: PublicKey | null | undefined,
  options: Options<string, TData> = {},
) => {
  return useQuery({
    ...options,
    queryKey: options.queryKey ?? [
      "useReverseLookup",
      connection.rpcEndpoint,
      pubkey?.toBase58(),
    ],
    enabled: pubkey ? options.enabled : false,
    queryFn: () => {
      if (!pubkey) throw new Error("Domain public key is required");
      return reverseLookup(connection, pubkey);
    },
  });
};
