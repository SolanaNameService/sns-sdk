import { Address, GetAccountInfoApi, Instruction, Rpc } from "@solana/kit";

import { NAME_PROGRAM_ADDRESS } from "../constants/addresses";
import { UpdateNameRegistryInstruction } from "../instructions/updateNameRegistryInstruction";
import { RegistryState } from "../states/registry";
import { _deriveAddress } from "../utils/deriveAddress";

/**
 * Input for updating bytes in a raw SNS name-registry account.
 *
 * @example
 * ```ts
 * const params: UpdateNameRegistryParams = {
 *   rpc,
 *   domain: "example",
 *   offset: 0,
 *   data: new TextEncoder().encode("data"),
 * };
 * ```
 */
export interface UpdateNameRegistryParams {
  /** RPC client used to retrieve the registry owner. */
  rpc: Rpc<GetAccountInfoApi>;

  /** Raw registry seed/name to update. */
  domain: string;

  /** Byte offset where the update begins. */
  offset: number;

  /** Bytes to write to the registry. */
  data: Uint8Array;

  /** Optional class address for the registry. */
  classAddress?: Address;
  /**
   * Optional parent name-account address.
   */
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
 *
 * @example
 * ```ts
 * const instruction = await updateNameRegistry({
 *   rpc,
 *   domain: "example",
 *   offset: 0,
 *   data: new TextEncoder().encode("data"),
 * });
 * ```
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
