import { GetSlotApi, Rpc } from "@solana/kit";

import { SOL_TLD_CUTOFF_SLOT } from "../config";
import { UnsupportedTldError } from "../errors";
import {
  SOL_TLD,
  SupportedTld,
  parseSupportedTld,
} from "./tld";

const unsupportedRpcClients = new WeakSet<object>();

interface AssertTldSupportedParams {
  rpc: Rpc<GetSlotApi>;
  domain: string;
}

export const assertTldSupported = async ({
  rpc,
  domain,
}: AssertTldSupportedParams): Promise<[string, SupportedTld]> => {
  const [trimmedDomain, tld] = parseSupportedTld(domain);

  if (tld !== SOL_TLD) {
    return [trimmedDomain, tld as SupportedTld];
  }

  if (unsupportedRpcClients.has(rpc)) {
    throw new UnsupportedTldError("Legacy .sol domains are no longer supported");
  }

  const slot = await rpc.getSlot({ commitment: "finalized" }).send();
  if (slot >= SOL_TLD_CUTOFF_SLOT) {
    unsupportedRpcClients.add(rpc);
    throw new UnsupportedTldError("Legacy .sol domains are no longer supported");
  }

  return [trimmedDomain, SOL_TLD];
};
