import { Address, GetAccountInfoApi, Instruction, Rpc } from "@solana/kit";

import { NAME_PROGRAM_ADDRESS } from "../constants/addresses";
import { DeleteNameRegistryInstruction } from "../instructions/deleteNameRegistryInstruction";
import { RegistryState } from "../states/registry";
import { _deriveAddress } from "../utils/deriveAddress";

interface DeleteNameRegistryParams {
  rpc: Rpc<GetAccountInfoApi>;
  name: string;
  refundAddress: Address;
  classAddress?: Address;
  parentAddress?: Address;
}

/**
 * Deletes a raw SPL Name Registry account and refunds the associated rent
 * balance to the specified target.
 *
 * This low-level helper accepts a raw registry seed/name and does not parse
 * `.sns` or `.sol` suffixes.
 *
 * @param params Deletion parameters
 * @param params.rpc RPC client implementing account lookup
 * @param params.name Raw registry seed/name whose account will be deleted
 * @param params.refundAddress Address receiving the refunded rent balance
 * @param params.classAddress Optional class address for the registry
 * @param params.parentAddress Optional parent registry address
 * @returns Transaction instruction.
 */
export const deleteNameRegistry = async ({
  rpc,
  name,
  refundAddress,
  classAddress,
  parentAddress,
}: DeleteNameRegistryParams): Promise<Instruction> => {
  const domainAddress = await _deriveAddress(name, parentAddress, classAddress);

  const owner =
    classAddress || (await RegistryState.retrieve(rpc, domainAddress)).owner;

  const ix = new DeleteNameRegistryInstruction().getInstruction(
    NAME_PROGRAM_ADDRESS,
    domainAddress,
    refundAddress,
    owner
  );

  return ix;
};
