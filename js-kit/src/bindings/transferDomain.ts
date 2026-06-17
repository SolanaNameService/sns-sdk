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
 * Transfers a top-level .sns domain to a new owner.
 *
 * @param params - An object containing the following properties:
 *   - `rpc`: An RPC interface implementing GetAccountInfoApi.
 *   - `domain`: The full .sns domain name to be transferred.
 *   - `newOwner`: The address of the new owner of the domain.
 * @returns A promise that resolves to the transfer domain instruction.
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
