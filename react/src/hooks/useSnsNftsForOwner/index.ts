/**
 * Wallet-owned tokenized SNS domain queries through TanStack Query.
 * @module useSnsNftsForOwner
 */
import {
  getSnsNftsForOwner,
  type SnsNft,
} from "@bonfida/spl-name-service/address";
import type { Connection, PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

import type { Options } from "../../types";

/**
 * Retrieves tokenized `.sns` domains owned by a wallet through React Query.
 *
 * Returned domain names are TLD-trimmed and include the name-service account
 * and NFT mint public keys.
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
 * const { data: domains } = useSnsNftsForOwner(connection, wallet.publicKey);
 * ```
 */
export const useSnsNftsForOwner = <TData = SnsNft[]>(
  connection: Connection,
  owner: PublicKey | null | undefined,
  options: Options<SnsNft[], TData> = {},
) =>
  useQuery({
    ...options,
    queryKey: options.queryKey ?? [
      "useSnsNftsForOwner",
      connection.rpcEndpoint,
      owner?.toBase58(),
    ],
    enabled: owner ? options.enabled : false,
    queryFn: async () => {
      if (!owner) throw new Error("Owner is required");
      const domains = await getSnsNftsForOwner(connection, owner);
      return [...domains].sort((a, b) => a.domain.localeCompare(b.domain));
    },
  });
