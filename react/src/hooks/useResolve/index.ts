import { useQuery } from "@tanstack/react-query";
import { resolve } from "@bonfida/spl-name-service";
import type { Connection, PublicKey } from "@solana/web3.js";
import type { Options } from "../../types";

/**
 * Resolves a `.sns` or `.sol` domain to its target public key through React Query.
 *
 * @param connection Solana RPC connection
 * @param domain Full `.sns` or `.sol` domain name, or a nullish value to disable the query
 * @param options Optional React Query settings
 * @returns React Query result containing the resolved target public key
 */
export const useResolve = <TData = PublicKey>(
  connection: Connection,
  domain: string | null | undefined,
  options: Options<PublicKey, TData> = {},
) => {
  return useQuery({
    ...options,
    queryKey: options.queryKey ?? [
      "useResolve",
      connection.rpcEndpoint,
      domain,
    ],
    enabled: domain ? options.enabled : false,
    queryFn: () => {
      if (!domain) throw new Error("Domain is required");
      return resolve(connection, domain);
    },
  });
};
