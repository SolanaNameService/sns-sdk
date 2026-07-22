import {
  getSnsDomainsForOwner,
  type SnsDomain,
} from "@bonfida/spl-name-service/address";
import type { Connection, PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

import type { Options } from "../../types";

/**
 * Retrieves directly registry-owned top-level `.sns` domains for a wallet
 * through React Query.
 *
 * Tokenized domains and subdomains are not included.
 *
 * @param connection Solana RPC connection
 * @param owner Wallet public key, or a nullish value to disable the query
 * @param options Optional React Query settings
 * @returns React Query result containing sorted domain names and name account public keys
 */
export const useSnsDomainsForOwner = <TData = SnsDomain[]>(
  connection: Connection,
  owner: PublicKey | null | undefined,
  options: Options<SnsDomain[], TData> = {},
) =>
  useQuery({
    ...options,
    queryKey: options.queryKey ?? [
      "useSnsDomainsForOwner",
      connection.rpcEndpoint,
      owner?.toBase58(),
    ],
    enabled: owner ? options.enabled : false,
    queryFn: async () => {
      if (!owner) throw new Error("Owner is required");
      const domains = await getSnsDomainsForOwner(connection, owner);
      return [...domains].sort((a, b) => a.domain.localeCompare(b.domain));
    },
  });
