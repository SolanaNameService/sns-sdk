import { Address, GetAccountInfoApi, Instruction, Rpc } from "@solana/kit";

import {
  NAME_PROGRAM_ADDRESS,
  SNS_ROOT_DOMAIN_ACCOUNT,
} from "../constants/addresses";
import { TransferInstruction } from "../instructions/transferInstruction";
import { RegistryState } from "../states/registry";
import { _deriveAddress } from "../utils/deriveAddress";
import { _parseSnsTopLevelDomain } from "../utils/parseSnsDomain";

interface TransferDomainParams {
  rpc: Rpc<GetAccountInfoApi>;
  domain: string;
  newOwner: Address;
}

/**
 * Builds an instruction to transfer a top-level `.sns` domain.
 *
 * @param params Transfer parameters
 * @param params.rpc RPC client implementing account lookup
 * @param params.domain Full `.sns` domain name
 * @param params.newOwner New owner of the domain
 * @returns Transaction instruction.
 */
export const transferDomain = async ({
  rpc,
  domain,
  newOwner,
}: TransferDomainParams): Promise<Instruction> => {
  const trimmedDomain = _parseSnsTopLevelDomain(domain);

  const domainAddress = await _deriveAddress(
    trimmedDomain,
    SNS_ROOT_DOMAIN_ACCOUNT
  );

  const currentOwner = (await RegistryState.retrieve(rpc, domainAddress)).owner;

  const transferInstr = new TransferInstruction({ newOwner }).getInstruction(
    NAME_PROGRAM_ADDRESS,
    domainAddress,
    currentOwner
  );

  return transferInstr;
};
