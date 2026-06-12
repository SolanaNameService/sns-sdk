import { PublicKey } from "@solana/web3.js";
import { NAME_PROGRAM_ID } from "../constants";
import { getDomainKeySync } from "../utils/getDomainKeySync";
import { Record, RecordVersion } from "../types/record";
import { SNS_RECORDS_ID, writeRoa } from "@bonfida/sns-records";
import { InvalidParentError } from "../error";
import { parseSupportedTld, SNS_TLD } from "../utils/tld";

/**
 * Builds the instruction to write the Right of Association (RoA) identifier
 * for a V2 record, linking the record's content to a verifiable on-chain
 * identity (e.g. a wallet address stored in the SOL record).
 *
 * @param domain The full domain name including TLD (e.g. `"mydomain.sns"`)
 * @param record The record type to set the RoA for
 * @param owner The owner of the domain
 * @param payer The fee payer of the transaction
 * @param roaId The public key that serves as the Right of Association identifier
 * @returns A {@link TransactionInstruction} that writes the RoA
 * @throws {InvalidParentError} When the parent domain account cannot be resolved
 */
export const writRoaRecordV2 = (
  domain: string,
  record: Record,
  owner: PublicKey,
  payer: PublicKey,
  roaId: PublicKey,
) => {
  // Only allows .sns domains
  parseSupportedTld(domain, [SNS_TLD]);

  let { pubkey, parent, isSub } = getDomainKeySync(
    `${record}.${domain}`,
    RecordVersion.V2,
  );

  if (isSub) {
    parent = getDomainKeySync(domain).pubkey;
  }

  if (!parent) {
    throw new InvalidParentError("Parent could not be found");
  }
  const ix = writeRoa(
    payer,
    NAME_PROGRAM_ID,
    pubkey,
    parent,
    owner,
    roaId,
    SNS_RECORDS_ID,
  );
  return ix;
};
