/**
 * Wallet primary-domain lookup through TanStack Query.
 * @module usePrimaryDomain
 */
import { getPrimaryDomain } from "@bonfida/spl-name-service";
import { PrimaryDomainNotFoundError } from "@bonfida/spl-name-service/errors";
import type { Connection, PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

import type { Options } from "../../types";

/**
 * The resolved primary-domain data returned for a wallet with a configured primary domain.
 *
 * The `usePrimaryDomain` hook represents a missing primary domain as `null` instead.
 */
export type PrimaryDomainResult = Awaited<ReturnType<typeof getPrimaryDomain>>;

/**
 * Retrieves the primary domain set for a wallet through React Query.
 *
 * @param connection Solana RPC connection
 * @param owner Wallet public key, or a nullish value to disable the query
 * @param options Optional React Query settings
 * @returns React Query result where `data` is the primary domain, reverse name,
 * and stale status, or `null` when none is set; `isPending` tracks the initial
 * request, while failures populate `error` and set `isError` without throwing
 * during render.
 *
 * Query failures are exposed through the result's `error` and `isError` fields.
 *
 * @example
 * ```tsx
 * const { data, isError } = usePrimaryDomain(connection, wallet.publicKey);
 * ```
 */
export const usePrimaryDomain = <TData = PrimaryDomainResult | null>(
  connection: Connection,
  owner: PublicKey | null | undefined,
  options: Options<PrimaryDomainResult | null, TData> = {},
) =>
  useQuery({
    ...options,
    queryKey: options.queryKey ?? [
      "usePrimaryDomain",
      connection.rpcEndpoint,
      owner?.toBase58(),
    ],
    enabled: owner ? options.enabled : false,
    queryFn: async () => {
      if (!owner) throw new Error("Owner is required");
      try {
        return await getPrimaryDomain(connection, owner);
      } catch (error) {
        if (error instanceof PrimaryDomainNotFoundError) return null;
        throw error;
      }
    },
  });
