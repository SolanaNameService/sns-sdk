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

/**
 * Parameters for creating a reverse lookup record.
 *
 * @example
 * ```ts
 * const params: CreateReverseParams = { domainAddress, domain: "example", payer };
 * ```
 */
export interface CreateReverseParams {
  /** Domain account address. */
  domainAddress: Address;
  /** Raw reverse lookup payload. */
  domain: string;
  /** Account funding creation. */
  payer: Address;
  /** Parent domain address for a subdomain. */
  parentAddress?: Address;
  /** Parent domain owner for a subdomain. */
  parentOwner?: Address;
}

/**
 * Creates a raw reverse lookup record for the specified domain account.
 *
 * This low-level helper accepts the stored reverse payload as `domain` and
 * does not parse `.sns` or `.sol` suffixes.
 *
 * @param params Reverse lookup creation parameters
 * @param params.domainAddress Domain account the reverse lookup points to
 * @param params.domain Raw reverse payload to store
 * @param params.payer Account funding reverse lookup creation
 * @param params.parentAddress Optional parent domain address for subdomain reverse lookups
 * @param params.parentOwner Optional parent domain owner for subdomain reverse lookups
 * @returns Transaction instruction.
 *
 * @example
 * ```ts
 * const instruction = await createReverse({ domainAddress, domain: "example", payer });
 * ```
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
