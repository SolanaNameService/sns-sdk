import {
  GetAccountInfoApi,
  GetMultipleAccountsApi,
  GetSlotApi,
  GetTokenLargestAccountsApi,
  ReadonlyUint8Array,
  Rpc,
} from "@solana/kit";

import { MissingVerifierError } from "../errors";
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

interface GetDomainRecordsParams<
  T extends Record[],
  U extends { [K in keyof T]: ReadonlyUint8Array | undefined },
> {
  rpc: Rpc<
    GetAccountInfoApi &
      GetMultipleAccountsApi &
      GetTokenLargestAccountsApi &
      GetSlotApi
  >;
  domain: string;
  records: [...T];
  options?: {
    deserialize?: boolean;
    verifiers?: [...U];
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
 * Retrieves V2 records under a domain, verifies them, and optionally deserializes their content.
 *
 * @param params Record retrieval parameters
 * @param params.rpc RPC client implementing account, multiple-account, and token-largest-account APIs
 * @param params.domain Full domain name including a `.sns` or `.sol` suffix
 * @param params.records Record types to retrieve
 * @param params.options Optional record processing options
 * @param params.options.deserialize Whether to deserialize record content
 * @param params.options.verifiers Optional custom verifiers aligned with `records`
 * @returns Results aligned with `records`; entries are `undefined` when a V2 record account is missing.
 */
export async function getDomainRecords<
  T extends Record[],
  U extends { [K in keyof T]: ReadonlyUint8Array | undefined },
>({
  rpc,
  domain,
  records,
  options = {},
}: GetDomainRecordsParams<T, U>): Promise<(Result | undefined)[]> {
  const verifiers = options.verifiers;
  if (verifiers && verifiers.length !== records.length) {
    throw new MissingVerifierError(
      "The number of verifiers must be the same as the number of records"
    );
  }

  const [trimmedDomain] = await assertTldSupported({ rpc, domain });

  const [domainOwner, states] = await Promise.all([
    _getSnsDomainOwner({ rpc, domain: trimmedDomain }),
    Promise.all(
      records.map((record) =>
        getRecordV2Address({ domain: trimmedDomain, record })
      )
    ).then((addresses) => RecordState.retrieveBatch(rpc, addresses)),
  ]);

  return states.map((state, idx) => {
    if (!state) return undefined;

    const record = records[idx];
    const verifier =
      options.verifiers?.[idx] || _getDefaultVerifier({ record, state });
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
  });
}
