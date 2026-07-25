import { Address, GetAccountInfoApi, Instruction, Rpc } from "@solana/kit";

import { NAME_PROGRAM_ADDRESS } from "../constants/addresses";
import { getSnsDomainAddress } from "../domain/getSnsDomainAddress";
import { InvalidSubdomainError } from "../errors";
import { TransferInstruction } from "../instructions/transferInstruction";
import { RegistryState } from "../states/registry";
import { _parseSnsSubdomain } from "../utils/parseSnsDomain";

/**
 * Parameters for transferring an SNS subdomain.
 *
 * @example
 * ```ts
 * const params: TransferSubdomainParams = {
 *   rpc,
 *   subdomain: "sub.example.sns",
 *   newOwner,
 * };
 * ```
 */
export interface TransferSubdomainParams {
  /** RPC client. */
  rpc: Rpc<GetAccountInfoApi>;
  /** Full `.sns` subdomain name. */
  subdomain: string;
  /** New subdomain owner. */
  newOwner: Address;
  /** Whether the parent domain owner signs. */
  isParentOwnerSigner?: boolean;
  /** Current subdomain owner. Resolved when omitted. */
  currentOwner?: Address;
}

/**
 * Builds an instruction to transfer a `.sns` subdomain.
 *
 * @param params Transfer parameters
 * @param params.rpc RPC client implementing account lookup
 * @param params.subdomain Full `.sns` subdomain name
 * @param params.newOwner New owner of the subdomain
 * @param params.isParentOwnerSigner Whether the parent domain owner signs the transfer
 * @param params.currentOwner Optional current owner of the subdomain. Resolved automatically when omitted
 * @returns Transaction instruction.
 *
 * @example
 * ```ts
 * const instruction = await transferSubdomain({ rpc, subdomain: "sub.example.sns", newOwner });
 * ```
 */
export const transferSubdomain = async ({
  rpc,
  subdomain,
  newOwner,
  isParentOwnerSigner,
  currentOwner,
}: TransferSubdomainParams): Promise<Instruction> => {
  const [sub, parent] = _parseSnsSubdomain(subdomain);

  const {
    domainAddress,
    isSub,
    parentAddress: _parentAddress,
  } = await getSnsDomainAddress({ domain: `${sub}.${parent}` });

  if (!isSub || !_parentAddress) {
    throw new InvalidSubdomainError("The subdomain is not valid");
  }

  if (!currentOwner) {
    const registry = await RegistryState.retrieve(rpc, domainAddress);
    currentOwner = registry.owner;
  }

  let parentAddress: Address | undefined = undefined;
  let parentOwner: Address | undefined = undefined;

  if (isParentOwnerSigner) {
    parentAddress = _parentAddress;
    parentOwner = (await RegistryState.retrieve(rpc, _parentAddress)).owner;
  }

  const ix = new TransferInstruction({ newOwner }).getInstruction(
    NAME_PROGRAM_ADDRESS,
    domainAddress,
    currentOwner,
    undefined,
    parentAddress,
    parentOwner
  );

  return ix;
};
