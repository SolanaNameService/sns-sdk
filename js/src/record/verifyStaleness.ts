import { Record as SnsRecord, Validation } from "@bonfida/sns-records";
import { Connection, PublicKey } from "@solana/web3.js";

import { NameRegistryState } from "../state";
import { Record } from "../types/record";
import { assertTldSupported } from "../utils/assertTldSupported";
import { getSnsDomainKeySync } from "../utils/getSnsDomainKeySync";
import { getRecordV2Key } from "./getRecordV2Key";

/**
 * Verifies a record's staleness validation.
 *
 * @param connection Solana RPC connection
 * @param record Record type
 * @param domain Full `.sns` or `.sol` domain name
 * @returns Whether the record's staleness validation matches the current owner.
 */
export const verifyStaleness = async (
  connection: Connection,
  record: Record,
  domain: string,
) => {
  const [trimmedDomain] = await assertTldSupported(connection, domain);
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
