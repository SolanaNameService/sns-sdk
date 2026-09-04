import { Record as SnsRecord } from "@bonfida/sns-records";
import { Connection, PublicKey } from "@solana/web3.js";

import { NameRegistryState } from "../state";
import { Record } from "../types/record";
import { getSnsDomainKeySync } from "../utils/getSnsDomainKeySync";
import { _parseSnsDomain } from "../utils/parseSnsDomain";
import { Validation } from "./const";
import { getRecordV2Key } from "./getRecordV2Key";

/**
 * Verifies a record's staleness validation.
 *
 * @param connection Solana RPC connection
 * @param record Record type
 * @param domain Full `.sns` domain name
 * @returns Whether the record's staleness validation matches the current owner.
 * @throws {@link Errors.UnsupportedTldError} when the domain lacks a `.sns` suffix;
 * {@link Errors.InvalidDomainError} when the `.sns` domain or subdomain is invalid.
 *
 * @example
 * ```ts
 * const valid = await verifyStaleness(connection, Record.Url, "example.sns");
 * ```
 */
export const verifyStaleness = async (
  connection: Connection,
  record: Record,
  domain: string,
) => {
  const trimmedDomain = _parseSnsDomain(domain);
  const recordKey = getRecordV2Key(trimmedDomain, record);
  const { registry, nftOwner } = await NameRegistryState.retrieve(
    connection,
    getSnsDomainKeySync(trimmedDomain).pubkey,
  );
  const owner = nftOwner || registry.owner;
  const recordObj = await SnsRecord.retrieve(connection, recordKey);

  const stalenessId = recordObj.getStalenessId();

  return (
    owner?.equals(new PublicKey(stalenessId)) &&
    recordObj.header.stalenessValidation === Validation.Solana
  );
};
