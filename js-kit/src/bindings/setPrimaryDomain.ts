import { Address, GetAccountInfoApi, Instruction, Rpc } from "@solana/kit";

import {
  NAME_OFFERS_ADDRESS,
  SNS_ROOT_DOMAIN_ACCOUNT,
  SYSTEM_PROGRAM_ADDRESS,
} from "../constants/addresses";
import { RegisterPrimaryInstruction } from "../instructions/registerPrimaryInstruction";
import { PrimaryDomainState } from "../states/primaryDomain";
import { RegistryState } from "../states/registry";

/**
 * Input for setting an owner's already-derived SNS primary domain.
 *
 * @example
 * ```ts
 * const params: SetPrimaryDomainParams = { rpc, domainAddress, owner };
 * ```
 */
export interface SetPrimaryDomainParams {
  /** RPC client used to retrieve the domain registry. */
  rpc: Rpc<GetAccountInfoApi>;

  /** Already-derived SNS domain account address. */
  domainAddress: Address;

  /** Owner of the domain account. */
  owner: Address;
}

/**
 * Sets the primary domain for the specified owner.
 *
 * This is an address-only API: `domainAddress` must be an already-derived SNS
 * domain account.
 *
 * @param params Primary-domain registration parameters
 * @param params.rpc RPC client implementing account lookup
 * @param params.domainAddress SNS domain account address to set as primary
 * @param params.owner Owner of the domain account
 * @returns Transaction instruction.
 *
 * @example
 * ```ts
 * const instruction = await setPrimaryDomain({ rpc, domainAddress, owner });
 * ```
 */
export const setPrimaryDomain = async ({
  rpc,
  domainAddress,
  owner,
}: SetPrimaryDomainParams): Promise<Instruction> => {
  const [registry, primaryAddress] = await Promise.all([
    RegistryState.retrieve(rpc, domainAddress),
    PrimaryDomainState.getAddress(NAME_OFFERS_ADDRESS, owner),
  ]);

  const parent =
    registry.parentName !== SNS_ROOT_DOMAIN_ACCOUNT
      ? registry.parentName
      : undefined;

  const ix = new RegisterPrimaryInstruction().getInstruction(
    NAME_OFFERS_ADDRESS,
    domainAddress,
    primaryAddress,
    owner,
    SYSTEM_PROGRAM_ADDRESS,
    parent
  );
  return ix;
};
