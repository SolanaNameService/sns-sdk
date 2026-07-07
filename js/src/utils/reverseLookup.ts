import { Connection, PublicKey } from "@solana/web3.js";
import { NameRegistryState } from "../state";
import { NoAccountDataError } from "../error";
import { deserializeReverse } from "./deserializeReverse";
import { getReverseKeyFromDomainKey } from "./getReverseKeyFromDomainKey";

/**
 * Performs a reverse lookup for a domain account.
 *
 * @param connection Solana RPC connection
 * @param nameAccount Domain account public key to reverse look up
 * @param parent Optional parent name account for subdomain reverse lookups
 * @returns Human-readable domain name.
 */
export async function reverseLookup(
  connection: Connection,
  nameAccount: PublicKey,
  parent?: PublicKey,
): Promise<string> {
  const reverseKey = getReverseKeyFromDomainKey(nameAccount, parent);

  const { registry } = await NameRegistryState.retrieve(connection, reverseKey);
  if (!registry.data) {
    throw new NoAccountDataError("The registry data is empty");
  }

  return deserializeReverse(registry.data, !!parent);
}
