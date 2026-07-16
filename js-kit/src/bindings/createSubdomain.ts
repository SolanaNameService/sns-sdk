import {
  Address,
  GetAccountInfoApi,
  GetMinimumBalanceForRentExemptionApi,
  Instruction,
  Rpc,
  fetchEncodedAccount,
} from "@solana/kit";

import { getSnsDomainAddress } from "../domain/getSnsDomainAddress";
import { RegistryState } from "../states/registry";
import { getReverseAddress } from "../utils/getReverseAddress";
import { _parseSnsSubdomain } from "../utils/parseSnsDomain";
import { createNameRegistry } from "./createNameRegistry";
import { createReverse } from "./createReverse";

interface CreateSubdomainParams {
  rpc: Rpc<GetAccountInfoApi & GetMinimumBalanceForRentExemptionApi>;
  subdomain: string;
  owner: Address;
  space?: number;
  feePayer?: Address;
}

/**
 * Builds the instructions to create a `.sns` subdomain.
 *
 * The subdomain registry instruction is always included. The reverse lookup
 * instruction is included only when the reverse lookup account does not exist.
 *
 * @param params Subdomain creation parameters
 * @param params.rpc RPC client implementing account and rent-exemption APIs
 * @param params.subdomain Full `.sns` subdomain name
 * @param params.owner New subdomain owner and parent owner for reverse lookup creation
 * @param params.space Optional space in bytes allocated to the subdomain account. Defaults to 2,000
 * @param params.feePayer Optional account funding subdomain creation. Defaults to `owner`
 * @returns Transaction instructions.
 */
export const createSubdomain = async ({
  rpc,
  subdomain,
  owner,
  space = 2_000,
  feePayer,
}: CreateSubdomainParams): Promise<Instruction[]> => {
  const ixs: Instruction[] = [];
  const [sub, parent] = _parseSnsSubdomain(subdomain);
  const trimmedSubdomain = `${sub}.${parent}`;

  const [{ domainAddress, parentAddress }, lamports] = await Promise.all([
    getSnsDomainAddress({ domain: trimmedSubdomain }),
    rpc
      .getMinimumBalanceForRentExemption(
        BigInt(space + RegistryState.HEADER_LEN)
      )
      .send(),
  ]);

  const ix_create = await createNameRegistry({
    rpc,
    name: "\0".concat(sub),
    space,
    payer: feePayer || owner,
    owner,
    lamports,
    classAddress: undefined,
    parentAddress,
  });
  ixs.push(ix_create);

  // Create the reverse name
  const reverseKey = await getReverseAddress(trimmedSubdomain);
  const reverseAccount = await fetchEncodedAccount(rpc, reverseKey);

  if (!reverseAccount.exists) {
    const ix_reverse = await createReverse({
      domainAddress,
      domain: "\0".concat(sub),
      payer: feePayer || owner,
      parentAddress,
      parentOwner: owner,
    });
    ixs.push(ix_reverse);
  }

  return ixs;
};
