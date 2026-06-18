import { Address, Instruction } from "@solana/kit";

import {
  CENTRAL_STATE,
  NAME_PROGRAM_ADDRESS,
  REGISTRY_PROGRAM_ADDRESS,
  SNS_ROOT_DOMAIN_ACCOUNT,
  SYSTEM_PROGRAM_ADDRESS,
  SYSVAR_RENT_ADDRESS,
} from "../constants/addresses";
import { CreateReverseInstruction } from "../instructions/createReverseInstruction";
import { _deriveAddress } from "../utils/deriveAddress";

interface CreateReverseParams {
  domainAddress: Address;
  domain: string;
  payer: Address;
  parentAddress?: Address;
  parentOwner?: Address;
}

/**
 * Creates a raw reverse lookup record for the specified domain account.
 *
 * This low-level helper accepts the stored reverse payload as `domain` and
 * does not parse `.sns` or `.sol` suffixes.
 *
 * @param params - An object containing the following properties:
 *   - `domainAddress`: The address of the domain for which the reverse lookup record is created.
 *   - `domain`: The domain name to be associated with the reverse lookup record.
 *   - `payer`: The address funding the creation of the reverse lookup record.
 *   - `parentAddress`: (Optional) The address of the parent domain, if applicable.
 *   - `parentOwner`: (Optional) The address of the parent domain owner, if applicable.
 * @returns A promise which resolves to the create reverse lookup instruction.
 */
export const createReverse = async ({
  domainAddress,
  domain,
  payer,
  parentAddress,
  parentOwner,
}: CreateReverseParams): Promise<Instruction> => {
  const reverseLookupAccount = await _deriveAddress(
    domainAddress,
    parentAddress,
    CENTRAL_STATE
  );

  let ix = new CreateReverseInstruction({
    domain: domain,
  }).getInstruction(
    REGISTRY_PROGRAM_ADDRESS,
    NAME_PROGRAM_ADDRESS,
    SNS_ROOT_DOMAIN_ACCOUNT,
    reverseLookupAccount,
    SYSTEM_PROGRAM_ADDRESS,
    CENTRAL_STATE,
    payer,
    SYSVAR_RENT_ADDRESS,
    parentAddress,
    parentOwner
  );

  return ix;
};
