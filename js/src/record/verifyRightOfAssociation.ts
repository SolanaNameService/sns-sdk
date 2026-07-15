import { Record as SnsRecord, Validation } from "@bonfida/sns-records";
import { Connection } from "@solana/web3.js";

import { MissingVerifierError } from "../error";
import { Record } from "../types/record";
import { assertTldSupported } from "../utils/assertTldSupported";
import { ETH_ROA_RECORDS, GUARDIANS } from "./const";
import { getRecordV2Key } from "./getRecordV2Key";

/**
 * Verifies a record's Right of Association validation.
 *
 * This does not verify staleness; callers must verify staleness separately.
 *
 * @param connection Solana RPC connection
 * @param record Record type
 * @param domain Full `.sns` or `.sol` domain name
 * @param verifier Optional verifier. Required when no guardian exists for the record
 * @returns Whether the record's Right of Association validation matches the verifier.
 */
export const verifyRightOfAssociation = async (
  connection: Connection,
  record: Record,
  domain: string,
  verifier?: Buffer,
) => {
  verifier = verifier ?? GUARDIANS.get(record)?.toBuffer();
  if (!verifier) {
    throw new MissingVerifierError("You must specify the verifier");
  }

  const [trimmedDomain] = await assertTldSupported(connection, domain);
  const recordKey = getRecordV2Key(trimmedDomain, record);
  const recordObj = await SnsRecord.retrieve(connection, recordKey);

  const roaId = recordObj.getRoAId();

  const validation = ETH_ROA_RECORDS.has(record)
    ? Validation.Ethereum
    : Validation.Solana;

  return (
    verifier.compare(roaId) === 0 &&
    recordObj.header.rightOfAssociationValidation === validation
  );
};
