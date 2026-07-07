import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";

import { NameRegistryState } from "../state";
import { getDomainKeySync } from "../utils/getDomainKeySync";
import { _parseSnsSubdomain } from "../utils/parseSnsDomain";
import { getReverseKeySync } from "../utils/getReverseKeySync";
import { createNameRegistry } from "./createNameRegistry";
import { createReverse } from "./createReverse";

/**
 * Builds the instructions to create a `.sns` subdomain.
 *
 * @param connection Solana RPC connection
 * @param subdomain Full `.sns` subdomain name
 * @param owner Owner of the parent domain creating the subdomain
 * @param space Space to allocate to the subdomain. Defaults to 2 kB
 * @param feePayer Optional fee payer. Defaults to `owner`
 * @returns Transaction instructions.
 */
export const createSubdomain = async (
  connection: Connection,
  subdomain: string,
  owner: PublicKey,
  space = 2_000,
  feePayer?: PublicKey,
) => {
  const ixs: TransactionInstruction[] = [];
  const [sub] = _parseSnsSubdomain(subdomain);

  const { parent, pubkey } = getDomainKeySync(subdomain);

  // Space allocated to the subdomains
  const lamports = await connection.getMinimumBalanceForRentExemption(
    space + NameRegistryState.HEADER_LEN,
  );

  const ix_create = await createNameRegistry(
    connection,
    "\0".concat(sub),
    space, // Hardcode space to 2kB
    feePayer || owner,
    owner,
    lamports,
    undefined,
    parent,
  );
  ixs.push(ix_create);

  // Create the reverse name
  const reverseKey = getReverseKeySync(subdomain, true);
  const info = await connection.getAccountInfo(reverseKey);
  if (!info?.data) {
    const ix_reverse = await createReverse(
      pubkey,
      "\0".concat(sub),
      feePayer || owner,
      parent,
      owner,
    );
    ixs.push(...ix_reverse);
  }

  return ixs;
};
