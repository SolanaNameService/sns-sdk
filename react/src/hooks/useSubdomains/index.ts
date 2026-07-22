import type { Options } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { findSubdomains, getSnsDomainKeySync } from "@bonfida/spl-name-service";
import type { Connection } from "@solana/web3.js";

/**
 * Finds subdomains for an SNS parent domain through React Query.
 *
 * @param connection Solana RPC connection
 * @param domain TLD-trimmed SNS parent domain name, such as `example`
 * @param options Optional React Query settings
 * @returns React Query result containing human-readable subdomain names
 */
export const useSubdomains = <TData = string[]>(
  connection: Connection,
  domain: string,
  options: Options<string[], TData> = {},
) =>
  useQuery({
    ...options,
    queryKey: options.queryKey ?? [
      "useSubdomains",
      connection.rpcEndpoint,
      domain,
    ],
    queryFn: () => {
      if (!domain) throw new Error("Domain is required");
      return findSubdomains(connection, getSnsDomainKeySync(domain).pubkey);
    },
  });
