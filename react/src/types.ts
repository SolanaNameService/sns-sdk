/**
 * Shared React Query option types used by SNS hooks.
 * @module Types
 */
import type { QueryKey, UseQueryOptions } from "@tanstack/react-query";

/**
 * React Query options supported by SNS React hooks.
 *
 * `TData` remains caller-selectable through React Query's `select` option.
 */
export type Options<
  TQueryFnData = unknown,
  TData = TQueryFnData,
  TError = Error,
> = Omit<
  UseQueryOptions<TQueryFnData, TError, TData, QueryKey>,
  "queryFn" | "queryKey"
> & {
  /** Optional override for the hook's generated query key. */
  queryKey?: QueryKey;
};
