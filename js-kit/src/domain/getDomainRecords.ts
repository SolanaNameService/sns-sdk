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
import { assertTldSupported } from "../utils/assertTldSupported";
import { deserializeRecordContent } from "../utils/deserializers/deserializeRecordContent";
import { _getSnsDomainOwner } from "./getSnsDomainOwner";

/**
 * Options for retrieving domain records.
 *
 * @example
 * ```ts
 * const options: GetDomainRecordsOptions<[Record.Url], [undefined]> = {
 *   deserialize: true,
 *   verifiers: [undefined],
 * };
 * ```
 */
export interface GetDomainRecordsOptions<
  T extends Record[],
  U extends { [K in keyof T]: ReadonlyUint8Array | undefined },
> {
  /** Whether to decode record content. */
  deserialize?: boolean;
  /** Right of Association verifiers by record position. */
  verifiers?: [...U];
}

/**
 * Parameters for retrieving domain records.
 *
 * @example
 * ```ts
 * const params: GetDomainRecordsParams<[Record.Url], [undefined]> = {
 *   rpc,
 *   domain: "example.sns",
 *   records: [Record.Url],
 * };
 * ```
 */
export interface GetDomainRecordsParams<
  T extends Record[],
  U extends { [K in keyof T]: ReadonlyUint8Array | undefined },
> {
  /** RPC client. */
  rpc: Rpc<
    GetAccountInfoApi &
      GetMultipleAccountsApi &
      GetTokenLargestAccountsApi &
      GetSlotApi
  >;
  /** Full domain name. */
  domain: string;
  /** Record types to retrieve. */
  records: [...T];
  /** Record retrieval options. */
  options?: GetDomainRecordsOptions<T, U>;
}

/**
 * Verification status for a domain record.
 *
 * @example
 * ```ts
 * const verified: GetDomainRecordsVerification = { staleness: true };
 * ```
 */
export interface GetDomainRecordsVerification {
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
 * const result: GetDomainRecordsResult = {
 *   record: Record.Url,
 *   retrievedRecord,
 *   verified: { staleness: true },
 * };
 * ```
 */
export interface GetDomainRecordsResult {
  /** Record type. */
  record: Record;
  /** Retrieved record state. */
  retrievedRecord: RecordState;
  /** Verification status. */
  verified: GetDomainRecordsVerification;
  /** Decoded record content. */
  deserializedContent?: string;
}

/**
 * Retrieves V2 records under a domain, verifies them, and optionally decodes their content.
 *
 * @param params Record retrieval parameters
 * @param params.rpc RPC client implementing account, multiple-account, and token-largest-account APIs
 * @param params.domain Full domain name including a `.sns` or `.sol` suffix
 * @param params.records Record types to retrieve
 * @param params.options Optional record processing options
 * @returns Results aligned with `records`; missing V2 record accounts produce `undefined`
 *
 * @example
 * ```ts
 * const results = await getDomainRecords({ rpc, domain: "example.sns", records: [Record.Url] });
 * ```
 */
export async function getDomainRecords<
  T extends Record[],
  U extends { [K in keyof T]: ReadonlyUint8Array | undefined },
>({
  rpc,
  domain,
  records,
  options = {},
}: GetDomainRecordsParams<T, U>): Promise<
  (GetDomainRecordsResult | undefined)[]
> {
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
