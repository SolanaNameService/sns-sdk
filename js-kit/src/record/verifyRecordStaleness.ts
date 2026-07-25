import {
  Address,
  GetAccountInfoApi,
  GetSlotApi,
  GetTokenLargestAccountsApi,
  Rpc,
} from "@solana/kit";

import { addressCodec } from "../codecs";
import { _getSnsDomainOwner } from "../domain/getSnsDomainOwner";
import { getRecordV2Address } from "../record/getRecordV2Address";
import { RecordState } from "../states/record";
import { Record } from "../types/record";
import { Validation } from "../types/validation";
import { assertTldSupported } from "../utils/assertTldSupported";
import { uint8ArraysEqual } from "../utils/uint8Array/uint8ArraysEqual";

/**
 * Internal helper that verifies a record's staleness validation.
 *
 * @param params Staleness verification parameters
 * @param params.domainOwner Current owner of the domain
 * @param params.state Record state to verify
 * @returns True if the record's staleness validation passes, false otherwise.
 *
 * @example
 * ```ts
 * const valid = _verifyStalenessSync({ domainOwner, state });
 * ```
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

/**
 * Parameters for verifying record staleness.
 *
 * @example
 * ```ts
 * const params: VerifyRecordStalenessParams = {
 *   rpc,
 *   domain: "example.sns",
 *   record: Record.Url,
 * };
 * ```
 */
export interface VerifyRecordStalenessParams {
  /** RPC client. */
  rpc: Rpc<GetAccountInfoApi & GetTokenLargestAccountsApi & GetSlotApi>;
  /** Full domain name. */
  domain: string;
  /** Record type. */
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
 *
 * @example
 * ```ts
 * const valid = await verifyRecordStaleness({ rpc, domain: "example.sns", record: Record.Url });
 * ```
 */
export const verifyRecordStaleness = async ({
  rpc,
  domain,
  record,
}: VerifyRecordStalenessParams): Promise<boolean> => {
  const [trimmedDomain] = await assertTldSupported({ rpc, domain });
  const [domainOwner, state] = await Promise.all([
    _getSnsDomainOwner({ rpc, domain: trimmedDomain }),
    getRecordV2Address({ domain: trimmedDomain, record }).then((address) =>
      RecordState.retrieve(rpc, address)
    ),
  ]);

  return _verifyStalenessSync({ domainOwner, state });
};
