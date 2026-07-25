import {
  Address,
  GetAccountInfoApi,
  GetMultipleAccountsApi,
  GetSlotApi,
  GetTokenLargestAccountsApi,
  Rpc,
} from "@solana/kit";

/** Controls whether resolution may return program-derived addresses. */
export type ResolveOptions =
  | { allowPda: false; programIds?: never }
  | { allowPda: "any"; programIds?: never }
  | { allowPda: true; programIds: Address[] };

/** RPC client type for domain resolution. */
export type ResolveRpc = Rpc<
  GetAccountInfoApi &
    GetMultipleAccountsApi &
    GetTokenLargestAccountsApi &
    GetSlotApi
>;

/**
 * Parameters for resolving a domain.
 *
 * @example
 * ```ts
 * const params: ResolveParams = { rpc, domain: "example.sns" };
 * ```
 */
export interface ResolveParams {
  /** RPC client. */
  rpc: ResolveRpc;
  /** Full domain name. */
  domain: string;
  /** Resolution options. */
  options?: ResolveOptions;
}

/** Input required by the SNS-specific domain resolver. */
export interface ResolveSnsParams {
  rpc: Rpc<
    GetAccountInfoApi & GetMultipleAccountsApi & GetTokenLargestAccountsApi
  >;
  domain: string;
  options: ResolveOptions;
}

/** Input required by the `.sol` domain resolver. */
export interface ResolveSolParams {
  rpc: Rpc<GetAccountInfoApi>;
  domain: string;
  options: ResolveOptions;
}
