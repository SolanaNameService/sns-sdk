import {
  Address,
  GetAccountInfoApi,
  GetMinimumBalanceForRentExemptionApi,
  Instruction,
  Rpc,
} from "@solana/kit";

import {
  NAME_PROGRAM_ADDRESS,
  SYSTEM_PROGRAM_ADDRESS,
} from "../constants/addresses";
import { CreateNameRegistryInstruction } from "../instructions/createNameRegistryInstruction";
import { RegistryState } from "../states/registry";
import { _generateHash, _getAddressFromHash } from "../utils/deriveAddress";

/**
 * Parameters for creating a name registry.
 *
 * @example
 * ```ts
 * const params: CreateNameRegistryParams = { rpc, name: "example", space: 32, payer, owner };
 * ```
 */
export interface CreateNameRegistryParams {
  /** RPC client. */
  rpc: Rpc<GetAccountInfoApi & GetMinimumBalanceForRentExemptionApi>;
  /** Raw registry name. */
  name: string;
  /** Account data size in bytes. */
  space: number;
  /** Account paying for creation. */
  payer: Address;
  /** Owner of the new registry. */
  owner: Address;
  /** Account funding amount. Defaults to the rent-exempt minimum. */
  lamports?: bigint;
  /** Registry class address. */
  classAddress?: Address;
  /** Parent registry address. */
  parentAddress?: Address;
}

/**
 * Creates a raw SPL Name Registry account with the given rent budget,
 * allocated space, owner, and class.
 *
 * This low-level helper accepts a raw registry seed/name and does not parse
 * `.sns` or `.sol` suffixes.
 *
 * @param params Creation parameters
 * @param params.rpc RPC client implementing account and rent-exemption APIs
 * @param params.name Raw registry seed/name for the new account
 * @param params.space Space in bytes allocated to the account
 * @param params.payer Account paying for allocation
 * @param params.owner Owner of the new name account
 * @param params.lamports Optional lamports to fund the account. Defaults to the rent-exempt minimum
 * @param params.classAddress Optional class address for the registry
 * @param params.parentAddress Optional parent registry address
 * @returns Transaction instruction.
 *
 * @example
 * ```ts
 * const instruction = await createNameRegistry({ rpc, name: "example", space: 32, payer, owner });
 * ```
 */
export const createNameRegistry = async ({
  rpc,
  name,
  space,
  payer,
  owner,
  lamports,
  classAddress,
  parentAddress,
}: CreateNameRegistryParams): Promise<Instruction> => {
  const nameHash = await _generateHash(name);
  const domainAddress = await _getAddressFromHash(
    nameHash,
    parentAddress,
    classAddress
  );

  lamports =
    lamports ||
    (await rpc
      .getMinimumBalanceForRentExemption(
        BigInt(space + RegistryState.HEADER_LEN)
      )
      .send());

  let parentOwner: Address | undefined;
  if (parentAddress) {
    const parentAccount = await RegistryState.retrieve(rpc, parentAddress);
    parentOwner = parentAccount.owner;
  }

  const ix = new CreateNameRegistryInstruction({
    nameHash,
    lamports,
    space,
  }).getInstruction(
    NAME_PROGRAM_ADDRESS,
    SYSTEM_PROGRAM_ADDRESS,
    domainAddress,
    owner,
    payer,
    classAddress,
    parentAddress,
    parentOwner
  );

  return ix;
};
