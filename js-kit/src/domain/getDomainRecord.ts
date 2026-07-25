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
import { assertTldSupported } from "../utils/assertTldSupported";
import { deserializeRecordContent } from "../utils/deserializers/deserializeRecordContent";
import { _getSnsDomainOwner } from "./getSnsDomainOwner";

/**
 * Options for retrieving a domain record.
 *
 * @example
 * ```ts
 * const options: GetDomainRecordOptions = { deserialize: true };
 * ```
 */
export interface GetDomainRecordOptions {
  /** Whether to decode record content. */
  deserialize?: boolean;
  /** Custom Right of Association verifier. */
  verifier?: ReadonlyUint8Array;
}

/**
 * Parameters for retrieving a domain record.
 *
 * @example
 * ```ts
 * const params: GetDomainRecordParams = {
 *   rpc,
 *   domain: "example.sns",
 *   record: Record.Url,
 * };
 * ```
 */
export interface GetDomainRecordParams {
  /** RPC client. */
  rpc: Rpc<
    GetAccountInfoApi &
      GetMultipleAccountsApi &
      GetTokenLargestAccountsApi &
      GetSlotApi
  >;
  /** Full domain name. */
  domain: string;
  /** Record type to retrieve. */
  record: Record;
  /** Record retrieval options. */
  options?: GetDomainRecordOptions;
}

/**
 * Verification status for a domain record.
 *
 * @example
 * ```ts
 * const verified: GetDomainRecordVerification = { staleness: true };
 * ```
 */
export interface GetDomainRecordVerification {
  /** Whether the record is current. */
  staleness: boolean;
  /** Right of Association verification result. */
  roa?: boolean;
}

/**
 * A retrieved domain record.
 *
 * @example
 * ```ts
 * const result: GetDomainRecordResult = {
 *   record: Record.Url,
 *   retrievedRecord,
 *   verified: { staleness: true },
 * };
 * ```
 */
export interface GetDomainRecordResult {
  /** Record type. */
  record: Record;
  /** Retrieved record state. */
  retrievedRecord: RecordState;
  /** Verification status. */
  verified: GetDomainRecordVerification;
  /** Decoded record content. */
  deserializedContent?: string;
}

/**
 * Retrieves a V2 record under a domain, verifies it, and optionally decodes its content.
 *
 * @param params Record retrieval parameters
 * @param params.rpc RPC client implementing account, multiple-account, and token-largest-account APIs
 * @param params.domain Full domain name including a `.sns` or `.sol` suffix
 * @param params.record Record type to retrieve
 * @param params.options Optional record processing options
 * @returns The V2 record state, its verification result, and optional decoded content
 *
 * @example
 * ```ts
 * const result = await getDomainRecord({ rpc, domain: "example.sns", record: Record.Url });
 * ```
 */
export async function getDomainRecord({
  rpc,
  domain,
  record,
  options = {},
}: GetDomainRecordParams): Promise<GetDomainRecordResult> {
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
