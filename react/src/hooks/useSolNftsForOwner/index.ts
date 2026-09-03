/**
 * Wallet-owned tokenized `.sol` domain queries through TanStack Query.
 * @module useSolNftsForOwner
 */
import {
  getSolNftsForOwner,
  type SolNft,
} from "@bonfida/spl-name-service/address";
import type { Connection, PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

import type { Options } from "../../types";

/**
 * Retrieves non-expired tokenized `.sol` domains owned by a wallet through
 * React Query.
 *
 * Returned domain names are TLD-trimmed and include the SRS record and NFT mint
 * public keys.
 *
 * @param connection Solana RPC connection
 * @param owner Wallet public key, or a nullish value to disable the query
 * @param options Optional React Query settings
 * @returns React Query result where `data` contains sorted tokenized domain
 * records; `isPending` tracks the initial request, while failures populate
 * `error` and set `isError` without throwing during render.
 *
 * @example
 * ```tsx
 * const { data: domains } = useSolNftsForOwner(connection, wallet.publicKey);
 * ```
 */
export const useSolNftsForOwner = <TData = SolNft[]>(
  connection: Connection,
  owner: PublicKey | null | undefined,
  options: Options<SolNft[], TData> = {},
) =>
  useQuery({
    ...options,
    queryKey: options.queryKey ?? [
      "useSolNftsForOwner",
      connection.rpcEndpoint,
      owner?.toBase58(),
    ],
    enabled: owner ? options.enabled : false,
    queryFn: async () => {
      if (!owner) throw new Error("Owner is required");
      const domains = await getSolNftsForOwner(connection, owner);
      return [...domains].sort((a, b) => a.domain.localeCompare(b.domain));
    },
  });
