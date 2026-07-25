import {
  GetAccountInfoApi,
  GetSlotApi,
  GetTokenLargestAccountsApi,
  ReadonlyUint8Array,
  Rpc,
} from "@solana/kit";

import { addressCodec } from "../codecs";
import {
  ETH_ROA_RECORDS,
  GUARDIANS,
  SELF_SIGNED_RECORDS,
} from "../constants/records";
import { MissingVerifierError } from "../errors";
import { getRecordV2Address } from "../record/getRecordV2Address";
import { RecordState } from "../states/record";
import { Record } from "../types/record";
import { Validation } from "../types/validation";
import { assertTldSupported } from "../utils/assertTldSupported";
import { uint8ArraysEqual } from "../utils/uint8Array/uint8ArraysEqual";

/**
 * Internal helper that derives the default verifier for a record state.
 *
 * @param params Default verifier parameters
 * @param params.record Record type
 * @param params.state Record state
 * @returns The default verifier, or `undefined` when no verifier is found.
 *
 * @example
 * ```ts
 * const verifier = _getDefaultVerifier({ record: Record.Url, state });
 * ```
 */
export const _getDefaultVerifier = ({
  record,
  state,
}: {
  record: Record;
  state: RecordState;
}) => {
  if (SELF_SIGNED_RECORDS.has(record)) {
    return state.getContent();
  } else {
    const guardian = GUARDIANS.get(record);
    if (guardian) {
      return addressCodec.encode(guardian);
    }
  }
  return undefined;
};

/**
 * Internal helper that verifies a record's Right of Association validation.
 *
 * Ethereum/secp256k1 validation is used for EVM RoA records; Solana validation
 * is used otherwise.
 *
 * @param params Right of Association verification parameters
 * @param params.record Record type to verify
 * @param params.state Record state
 * @param params.verifier Verifier for the record
 * @returns True if the association is valid, false otherwise.
 *
 * @example
 * ```ts
 * const valid = _verifyRoaSync({ record: Record.Url, state, verifier });
 * ```
 */
export const _verifyRoaSync = ({
  record,
  state,
  verifier,
}: {
  record: Record;
  state: RecordState;
  verifier: ReadonlyUint8Array;
}) => {
  const roaId = state.getRoAId();

  const validation = ETH_ROA_RECORDS.has(record)
    ? Validation.Ethereum
    : Validation.Solana;

  return (
    uint8ArraysEqual(roaId, verifier) &&
    state.header.rightOfAssociationValidation === validation
  );
};

/**
 * Verifies a record's Right of Association validation.
 *
 * @param rpc RPC client implementing account and token-largest-account APIs
 * @param domain Full domain name including a `.sns` or `.sol` suffix
 * @param record Record type to verify
 * @param verifier Optional verifier for the record. If omitted, a default verifier is derived
 * @returns True if the association is valid, false otherwise.
 * @throws MissingVerifierError If no verifier is specified and no default verifier is found.
 *
 * @example
 * ```ts
 * const valid = await verifyRecordRightOfAssociation(rpc, "example.sns", Record.Url);
 * ```
 */
export const verifyRecordRightOfAssociation = async (
  rpc: Rpc<GetAccountInfoApi & GetTokenLargestAccountsApi & GetSlotApi>,
  domain: string,
  record: Record,
  verifier?: ReadonlyUint8Array
) => {
  const [trimmedDomain] = await assertTldSupported({ rpc, domain });
  const address = await getRecordV2Address({
    domain: trimmedDomain,
    record,
  });
  const state = await RecordState.retrieve(rpc, address);

  verifier = verifier || _getDefaultVerifier({ record, state });
  if (!verifier) {
    throw new MissingVerifierError("You must specify the verifier");
  }

  return _verifyRoaSync({ record, state, verifier });
};
