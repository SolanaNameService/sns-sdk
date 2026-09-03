/**
 * Wallet-owned SRS `.sol` domain queries through TanStack Query.
 * @module useSolDomainsForOwner
 */
import {
  getSolDomainsForOwner,
  type SolDomain,
} from "@bonfida/spl-name-service/address";
import type { Connection, PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

import type { Options } from "../../types";

/**
 * Retrieves directly wallet-owned, non-expired top-level `.sol` domains
 * through React Query.
 *
 * Tokenized domains and subdomains are not included.
 *
 * @param connection Solana RPC connection
 * @param owner Wallet public key, or a nullish value to disable the query
 * @param options Optional React Query settings
 * @returns React Query result where `data` contains sorted domain names and
 * SRS record public keys; `isPending` tracks the initial request, while
 * failures populate `error` and set `isError` without throwing during render.
 *
 * @example
 * ```tsx
 * const { data: domains } = useSolDomainsForOwner(connection, wallet.publicKey);
 * ```
 */
export const useSolDomainsForOwner = <TData = SolDomain[]>(
  connection: Connection,
  owner: PublicKey | null | undefined,
  options: Options<SolDomain[], TData> = {},
) =>
  useQuery({
    ...options,
    queryKey: options.queryKey ?? [
      "useSolDomainsForOwner",
      connection.rpcEndpoint,
      owner?.toBase58(),
    ],
    enabled: owner ? options.enabled : false,
    queryFn: async () => {
      if (!owner) throw new Error("Owner is required");
      const domains = await getSolDomainsForOwner(connection, owner);
      return [...domains].sort((a, b) => a.domain.localeCompare(b.domain));
    },
  });
