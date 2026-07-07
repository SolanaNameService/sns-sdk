import { Connection, PublicKey } from "@solana/web3.js";
import { Record } from "../types/record";
import { getRecordV2Key } from "./getRecordV2Key";
import { Record as SnsRecord, Validation } from "@bonfida/sns-records";
import { NameRegistryState } from "../state";
import { getDomainKeySync } from "../utils/getDomainKeySync";

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
  const recordKey = getRecordV2Key(domain, record);
  const { registry, nftOwner } = await NameRegistryState.retrieve(
    connection,
    getDomainKeySync(domain).pubkey,
  );
  const owner = nftOwner || registry.owner;
  const recordObj = await SnsRecord.retrieve(connection, recordKey);

  const stalenessId = recordObj.getStalenessId();

  return (
    owner?.equals(new PublicKey(stalenessId)) &&
    recordObj.header.stalenessValidation === Validation.Solana
  );
};
