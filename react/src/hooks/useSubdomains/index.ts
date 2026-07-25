/**
 * SNS subdomain queries through TanStack Query.
 * @module useSubdomains
 */
import type { Options } from "../../types";
import { useQuery } from "@tanstack/react-query";
import {
  findSubdomains,
  getSnsDomainKeySync,
} from "@bonfida/spl-name-service/domain";
import type { Connection } from "@solana/web3.js";

/**
 * Finds subdomains for an SNS parent domain through React Query.
 *
 * @param connection Solana RPC connection
 * @param domain TLD-trimmed SNS parent domain name, such as `example`
 * @param options Optional React Query settings
 * @returns React Query result where `data` contains human-readable subdomain
 * names; `isPending` tracks the initial request, while failures populate
 * `error` and set `isError` without throwing during render.
 *
 * Query failures are exposed through the result's `error` and `isError` fields.
 *
 * @example
 * ```tsx
 * const { data: subdomains } = useSubdomains(connection, "example");
 * ```
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
