import { SNS_RECORDS_ID, validateSolanaSignature } from "@bonfida/sns-records";
import { PublicKey } from "@solana/web3.js";

import { NAME_PROGRAM_ID } from "../constants";
import { InvalidParentError } from "../error";
import { Record, RecordVersion } from "../types/record";
import { getDomainKeySync } from "../utils/getDomainKeySync";
import { _parseSnsDomain } from "../utils/parseSnsDomain";

interface RecordVerificationParams {
  domain: string;
  record: Record;
  owner: PublicKey;
  payer: PublicKey;
  verifier: PublicKey;
}

/**
 * Derives the V2 record account and the owning domain or subdomain account.
 *
 * Callers are responsible for applying any public API TLD restrictions before
 * invoking this helper. The key derivation itself follows `getDomainKeySync`.
 *
 * @param domain The full domain name including TLD (e.g. `"mydomain.sns"`)
 * @param record The record type whose V2 account should be derived
 * @returns The derived record account as `pubkey` and its owning parent account
 * @throws {InvalidParentError} When the owning domain account cannot be resolved
 */
export const _getRecordAndParentKey = ({
  domain,
  record,
}: {
  domain: string;
  record: Record;
}) => {
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

  return { pubkey, parent };
};

/**
 * Builds the SNS records program's Solana-signature validation instruction.
 *
 * The `staleness` flag selects the low-level program mode: `true` writes or
 * refreshes staleness verifier metadata, while `false` validates Right of
 * Association using the provided Solana verifier.
 *
 * @param staleness Whether to build the staleness verifier instruction mode
 * @param domain The full `.sns` domain or subdomain whose record is validated
 * @param record The record type whose V2 account is validated
 * @param owner The owner of the domain
 * @param payer The fee payer of the transaction
 * @param verifier The Solana verifier account used by the selected mode
 * @returns A transaction instruction for the SNS records program
 * @throws {UnsupportedTldError} When `domain` is not a `.sns` domain
 * @throws {InvalidParentError} When the owning domain account cannot be resolved
 */
export const _buildValidateSolanaSignatureInstruction = ({
  staleness,
  domain,
  record,
  owner,
  payer,
  verifier,
}: RecordVerificationParams & {
  staleness: boolean;
}) => {
  _parseSnsDomain(domain);

  const { pubkey, parent } = _getRecordAndParentKey({ domain, record });

  return validateSolanaSignature(
    payer,
    pubkey,
    parent,
    owner,
    verifier,
    NAME_PROGRAM_ID,
    staleness,
    SNS_RECORDS_ID,
  );
};
