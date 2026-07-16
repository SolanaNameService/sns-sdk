import {
  GetAccountInfoApi,
  GetMultipleAccountsApi,
  GetSlotApi,
  GetTokenLargestAccountsApi,
  ReadonlyUint8Array,
  Rpc,
} from "@solana/kit";

import { getRecordV2Address } from "../record/getRecordV2Address";
import {
  _getDefaultVerifier,
  _verifyRoaSync,
} from "../record/verifyRecordRightOfAssociation";
import { _verifyStalenessSync } from "../record/verifyRecordStaleness";
import { RecordState } from "../states/record";
import { Record } from "../types/record";
import { deserializeRecordContent } from "../utils/deserializers/deserializeRecordContent";
import { assertTldSupported } from "../utils/assertTldSupported";
import { _getSnsDomainOwner } from "./getDomainOwner";

interface GetDomainRecordParams {
  rpc: Rpc<
    GetAccountInfoApi &
      GetMultipleAccountsApi &
      GetTokenLargestAccountsApi &
      GetSlotApi
  >;
  domain: string;
  record: Record;
  options?: {
    deserialize?: boolean;
    verifier?: ReadonlyUint8Array;
  };
}

interface Result {
  record: Record;
  retrievedRecord: RecordState;
  verified: {
    staleness: boolean;
    roa?: boolean;
  };
  deserializedContent?: string;
}

/**
 * Retrieves a V2 record under a domain, verifies it, and optionally deserializes its content.
 *
 * @param params Record retrieval parameters
 * @param params.rpc RPC client implementing account, multiple-account, and token-largest-account APIs
 * @param params.domain Full domain name including a `.sns` or `.sol` suffix
 * @param params.record Record type to retrieve
 * @param params.options Optional record processing options
 * @param params.options.deserialize Whether to deserialize record content
 * @param params.options.verifier Optional custom verifier for the record
 * @returns The record type, retrieved V2 record state, verification result, and optional deserialized content.
 */
export async function getDomainRecord({
  rpc,
  domain,
  record,
  options = {},
}: GetDomainRecordParams): Promise<Result> {
  const [trimmedDomain] = await assertTldSupported({ rpc, domain });
  const [domainOwner, state] = await Promise.all([
    _getSnsDomainOwner({ rpc, domain: trimmedDomain }),
    getRecordV2Address({ domain: trimmedDomain, record }).then((address) =>
      RecordState.retrieve(rpc, address)
    ),
  ]);

  const verifier = options.verifier || _getDefaultVerifier({ record, state });
  const verified = {
    staleness: _verifyStalenessSync({ domainOwner, state }),
    ...(verifier && {
      roa: _verifyRoaSync({ record, state, verifier }),
    }),
  };

  return {
    record,
    retrievedRecord: state,
    verified,
    ...(options.deserialize && {
      deserializedContent: deserializeRecordContent({
        content: state.getContent(),
        record,
      }),
    }),
  };
}
