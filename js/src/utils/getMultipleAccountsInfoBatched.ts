import { AccountInfo, Connection, PublicKey } from "@solana/web3.js";

const MAX_MULTIPLE_ACCOUNTS = 100;

export const getMultipleAccountsInfoBatched = async (
  connection: Connection,
  addresses: PublicKey[],
): Promise<(AccountInfo<Buffer> | null)[]> => {
  const accounts: (AccountInfo<Buffer> | null)[] = [];

  for (
    let offset = 0;
    offset < addresses.length;
    offset += MAX_MULTIPLE_ACCOUNTS
  ) {
    accounts.push(
      ...(await connection.getMultipleAccountsInfo(
        addresses.slice(offset, offset + MAX_MULTIPLE_ACCOUNTS),
      )),
    );
  }

  return accounts;
};
