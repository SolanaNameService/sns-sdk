import {
  Address,
  GetMultipleAccountsApi,
  Rpc,
  fetchEncodedAccounts,
} from "@solana/kit";

const MAX_MULTIPLE_ACCOUNTS = 100;

type EncodedAccount = Awaited<ReturnType<typeof fetchEncodedAccounts>>[number];

/**
 * Fetches encoded accounts in ordered, sequential batches of 100.
 *
 * @param rpc RPC client implementing multiple-account lookup
 * @param addresses Account addresses to retrieve
 * @returns Encoded accounts in the same order as `addresses`, including missing entries
 *
 * @example
 * ```ts
 * const accounts = await fetchEncodedAccountsBatched(rpc, addresses);
 * ```
 */
export const fetchEncodedAccountsBatched = async (
  rpc: Rpc<GetMultipleAccountsApi>,
  addresses: Address[]
): Promise<EncodedAccount[]> => {
  const accounts: EncodedAccount[] = [];

  for (
    let offset = 0;
    offset < addresses.length;
    offset += MAX_MULTIPLE_ACCOUNTS
  ) {
    accounts.push(
      ...(await fetchEncodedAccounts(
        rpc,
        addresses.slice(offset, offset + MAX_MULTIPLE_ACCOUNTS)
      ))
    );
  }

  return accounts;
};
