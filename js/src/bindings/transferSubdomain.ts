import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { transferInstruction } from "../instructions/transferInstruction";
import { NameRegistryState } from "../state";
import { NAME_PROGRAM_ID } from "../constants";
import { getDomainKeySync } from "../utils/getDomainKeySync";
import { _parseSnsSubdomain } from "../utils/parseSnsDomain";

/**
 * Builds an instruction to transfer a `.sns` subdomain.
 *
 * @param connection Solana RPC connection
 * @param subdomain Full `.sns` subdomain name
 * @param newOwner New owner of the subdomain
 * @param isParentOwnerSigner Whether the parent name owner signs the transfer
 * @param owner Current owner of the subdomain. Resolved automatically when omitted
 * @returns Transaction instruction.
 */
export const transferSubdomain = async (
  connection: Connection,
  subdomain: string,
  newOwner: PublicKey,
  isParentOwnerSigner?: boolean,
  owner?: PublicKey,
): Promise<TransactionInstruction> => {
  _parseSnsSubdomain(subdomain);

  const { pubkey, parent } = getDomainKeySync(subdomain);

  if (!owner) {
    const { registry } = await NameRegistryState.retrieve(connection, pubkey);
    owner = registry.owner;
  }

  let nameParent: PublicKey | undefined = undefined;
  let nameParentOwner: PublicKey | undefined = undefined;

  if (isParentOwnerSigner) {
    nameParent = parent!;
    nameParentOwner = (await NameRegistryState.retrieve(connection, parent!))
      .registry.owner;
  }

  const ix = transferInstruction(
    NAME_PROGRAM_ID,
    pubkey,
    newOwner,
    owner,
    undefined,
    nameParent,
    nameParentOwner,
  );

  return ix;
};
