import { Address, GetAccountInfoApi, Instruction, Rpc } from "@solana/kit";

import { NAME_PROGRAM_ADDRESS } from "../constants/addresses";
import { UpdateNameRegistryInstruction } from "../instructions/updateNameRegistryInstruction";
import { RegistryState } from "../states/registry";
import { _deriveAddress } from "../utils/deriveAddress";

export interface UpdateNameRegistryParams {
  rpc: Rpc<GetAccountInfoApi>;
  domain: string;
  offset: number;
  data: Uint8Array;
  classAddress?: Address;
  parentAddress?: Address;
}

/**
 * Updates the data of a raw SPL Name Registry account.
 *
 * This low-level helper accepts a raw registry seed/name as `domain` and does
 * not parse `.sns` or `.sol` suffixes.
 *
 * @param params Update parameters
 * @param params.rpc RPC client implementing account lookup
 * @param params.domain Raw registry seed/name whose account will be updated
 * @param params.offset Offset in bytes where the update should begin
 * @param params.data Data to write to the registry
 * @param params.classAddress Optional class address for the registry
 * @param params.parentAddress Optional parent registry address
 * @returns Transaction instruction.
 */
export async function updateNameRegistry({
  rpc,
  domain,
  offset,
  data,
  classAddress,
  parentAddress,
}: UpdateNameRegistryParams): Promise<Instruction> {
  const domainAddress = await _deriveAddress(
    domain,
    parentAddress,
    classAddress
  );

  const signer =
    classAddress || (await RegistryState.retrieve(rpc, domainAddress)).owner;

  const ix = new UpdateNameRegistryInstruction({
    offset,
    inputData: data,
  }).getInstruction(NAME_PROGRAM_ADDRESS, domainAddress, signer);

  return ix;
}
