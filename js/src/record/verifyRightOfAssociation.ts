import { Record } from "../types/record";
import { MissingVerifierError } from "../error";
import { Connection } from "@solana/web3.js";
import { Record as SnsRecord, Validation } from "@bonfida/sns-records";

import { assertMainnetDomainSupported } from "../utils/assertMainnetDomainSupported";
import { getRecordV2Key } from "./getRecordV2Key";
import { ETH_ROA_RECORDS, GUARDIANS } from "./const";

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

  await assertMainnetDomainSupported(connection, domain);
  const recordKey = getRecordV2Key(domain, record);
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
