import type { QueryKey, UseQueryOptions } from "@tanstack/react-query";

/** React Query options supported by SNS React hooks. */
export type Options<
  TQueryFnData = unknown,
  TData = TQueryFnData,
  TError = Error,
> = Omit<
  UseQueryOptions<TQueryFnData, TError, TData, QueryKey>,
  "queryFn" | "queryKey"
> & {
  queryKey?: QueryKey;
};
