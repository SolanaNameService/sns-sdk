import {
  Address,
  GetAccountInfoApi,
  GetTokenLargestAccountsApi,
  Rpc,
} from "@solana/kit";

import { addressCodec } from "../codecs";
import { getDomainOwner } from "../domain/getDomainOwner";
import { getRecordV2Address } from "../record/getRecordV2Address";
import { RecordState } from "../states/record";
import { Record } from "../types/record";
import { Validation } from "../types/validation";
import { uint8ArraysEqual } from "../utils/uint8Array/uint8ArraysEqual";

/**
 * Internal helper that verifies a record's staleness validation.
 *
 * @param params Staleness verification parameters
 * @param params.domainOwner Current owner of the domain
 * @param params.state Record state to verify
 * @returns True if the record's staleness validation passes, false otherwise.
 */
export const _verifyStalenessSync = ({
  domainOwner,
  state,
}: {
  domainOwner: Address;
  state: RecordState;
}) => {
  const stalenessId = state.getStalenessId();

  return (
    uint8ArraysEqual(addressCodec.encode(domainOwner), stalenessId) &&
    state.header.stalenessValidation === Validation.Solana
  );
};

interface VerifyRecordStalenessParams {
  rpc: Rpc<GetAccountInfoApi & GetTokenLargestAccountsApi>;
  domain: string;
  record: Record;
}

/**
 * Verifies a record's staleness validation.
 *
 * @param params Staleness verification parameters
 * @param params.rpc RPC client implementing account and token-largest-account APIs
 * @param params.domain Full domain name including a `.sns` or `.sol` suffix
 * @param params.record Record type to verify
 * @returns True if the record's staleness validation passes, false otherwise.
 */
export const verifyRecordStaleness = async ({
  rpc,
  domain,
  record,
}: VerifyRecordStalenessParams): Promise<boolean> => {
  const [domainOwner, state] = await Promise.all([
    getDomainOwner({ rpc, domain }),
    getRecordV2Address({ domain, record }).then((address) =>
      RecordState.retrieve(rpc, address)
    ),
  ]);

  return _verifyStalenessSync({ domainOwner, state });
};
