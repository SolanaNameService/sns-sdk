import {
  Address,
  GetAccountInfoApi,
  GetMultipleAccountsApi,
  GetSlotApi,
  GetTokenLargestAccountsApi,
  Rpc,
} from "@solana/kit";

export type ResolveOptions =
  | { allowPda: false; programIds?: never }
  | { allowPda: "any"; programIds?: never }
  | { allowPda: true; programIds: Address[] };

export type ResolveRpc = Rpc<
  GetAccountInfoApi &
    GetMultipleAccountsApi &
    GetTokenLargestAccountsApi &
    GetSlotApi
>;

export interface ResolveParams {
  rpc: ResolveRpc;
  domain: string;
  options?: ResolveOptions;
}

export interface ResolveSnsParams {
  rpc: Rpc<
    GetAccountInfoApi & GetMultipleAccountsApi & GetTokenLargestAccountsApi
  >;
  domain: string;
  options: ResolveOptions;
}

export interface ResolveSolParams {
  rpc: Rpc<GetAccountInfoApi>;
  domain: string;
  options: ResolveOptions;
}
