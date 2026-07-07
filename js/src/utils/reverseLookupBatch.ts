import { Connection, PublicKey } from "@solana/web3.js";
import { NameRegistryState } from "../state";
import { REVERSE_LOOKUP_CLASS } from "../constants";

import { getHashedNameSync } from "./getHashedNameSync";
import { getNameAccountKeySync } from "./getNameAccountKeySync";
import { deserializeReverse } from "./deserializeReverse";

/**
 * Performs reverse lookups for domain accounts.
 *
 * @param connection Solana RPC connection
 * @param nameAccounts Domain account public keys to reverse look up
 * @returns Human-readable domain names when reverse accounts exist.
 */
export async function reverseLookupBatch(
  connection: Connection,
  nameAccounts: PublicKey[],
): Promise<(string | undefined)[]> {
  let reverseLookupAccounts: PublicKey[] = [];
  for (let nameAccount of nameAccounts) {
    const hashedReverseLookup = getHashedNameSync(nameAccount.toBase58());
    const reverseLookupAccount = getNameAccountKeySync(
      hashedReverseLookup,
      REVERSE_LOOKUP_CLASS,
    );
    reverseLookupAccounts.push(reverseLookupAccount);
  }

  let names = await NameRegistryState.retrieveBatch(
    connection,
    reverseLookupAccounts,
  );

  return names.map((name) => {
    if (name === undefined || name.data === undefined) {
      return undefined;
    }
    return deserializeReverse(name.data);
  });
}
