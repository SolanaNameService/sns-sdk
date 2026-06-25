import { Address, GetAccountInfoApi, Instruction, Rpc } from "@solana/kit";

import {
  NAME_OFFERS_ADDRESS,
  SNS_ROOT_DOMAIN_ACCOUNT,
  SYSTEM_PROGRAM_ADDRESS,
} from "../constants/addresses";
import { RegisterPrimaryInstruction } from "../instructions/registerPrimaryInstruction";
import { PrimaryDomainState } from "../states/primaryDomain";
import { RegistryState } from "../states/registry";

export interface SetPrimaryDomainParams {
  rpc: Rpc<GetAccountInfoApi>;
  domainAddress: Address;
  owner: Address;
}

/**
 * Sets the primary domain for the specified owner.
 *
 * This is an address-only API: `domainAddress` must be an already-derived SNS
 * domain account.
 *
 * @param params - An object containing the following properties:
 *   - `rpc`: An RPC interface implementing GetAccountInfoApi.
 *   - `domainAddress`: The SNS domain account address to be set as primary.
 *   - `owner`: The address of the domain owner.
 * @returns A promise which resolves to the set primary domain instruction.
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
