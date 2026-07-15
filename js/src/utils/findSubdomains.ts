import { Connection, PublicKey, MemcmpFilter } from "@solana/web3.js";
import { NAME_PROGRAM_ID } from "../constants";
import { REVERSE_LOOKUP_CLASS } from "../constants";

import { deserializeReverse } from "./deserializeReverse";
import { getReverseKeyFromDomainKey } from "./getReverseKeyFromDomainKey";

/**
 * Finds subdomains for a parent domain account.
 *
 * @param connection Solana RPC connection
 * @param parentKey Parent domain account public key
 * @returns Human-readable subdomain names.
 */
export const findSubdomains = async (
  connection: Connection,
  parentKey: PublicKey,
): Promise<string[]> => {
  // Fetch reverse accounts
  const filtersRevs: MemcmpFilter[] = [
    {
      memcmp: {
        offset: 0,
        bytes: parentKey.toBase58(),
      },
    },
    {
      memcmp: {
        offset: 64,
        bytes: REVERSE_LOOKUP_CLASS.toBase58(),
      },
    },
  ];
  const reverses = await connection.getProgramAccounts(NAME_PROGRAM_ID, {
    filters: filtersRevs,
  });

  const filtersSubs: MemcmpFilter[] = [
    {
      memcmp: {
        offset: 0,
        bytes: parentKey.toBase58(),
      },
    },
  ];
  const subs = await connection.getProgramAccounts(NAME_PROGRAM_ID, {
    filters: filtersSubs,
    dataSlice: { offset: 0, length: 0 },
  });

  const map = new Map<string, string | undefined>(
    reverses.map((e) => [
      e.pubkey.toBase58(),
      deserializeReverse(e.account.data.subarray(96), true),
    ]),
  );

  const result: string[] = [];
  subs.forEach((e) => {
    const revKey = getReverseKeyFromDomainKey(e.pubkey, parentKey).toBase58();
    const rev = map.get(revKey);
    if (!!rev) {
      result.push(rev);
    }
  });

  return result;
};
