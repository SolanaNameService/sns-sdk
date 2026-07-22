import type { Options } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { reverseLookup } from "@bonfida/spl-name-service";
import type { Connection, PublicKey } from "@solana/web3.js";

/**
 * Performs a reverse lookup for a domain account through React Query.
 *
 * @param connection Solana RPC connection
 * @param pubkey Domain account public key, or a nullish value to disable the query
 * @param options Optional React Query settings
 * @returns React Query result containing the human-readable domain name
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
