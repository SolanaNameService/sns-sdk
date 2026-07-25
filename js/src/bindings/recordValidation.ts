import { SNS_RECORDS_ID, validateSolanaSignature } from "@bonfida/sns-records";
import { PublicKey } from "@solana/web3.js";

import { NAME_PROGRAM_ID } from "../constants";
import { InvalidParentError } from "../error";
import { Record, RecordVersion } from "../types/record";
import { getSnsDomainKeySync } from "../utils/getSnsDomainKeySync";
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
 * Expects a TLD-trimmed `.sns` domain that has already been validated by the
 * public binding.
 *
 * @param params Record derivation parameters
 * @param params.domain TLD-trimmed `.sns` domain name
 * @param params.record Record type
 * @returns Derived record account and parent account.
 * @throws {InvalidParentError} When the owning domain account cannot be resolved
 */
export const _getRecordAndParentKey = ({
  domain,
  record,
}: {
  domain: string;
  record: Record;
}) => {
  let { pubkey, parent, isSub } = getSnsDomainKeySync(
    `${record}.${domain}`,
    RecordVersion.V2,
  );

  if (isSub) {
    parent = getSnsDomainKeySync(domain).pubkey;
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
 * @param params Validation instruction parameters
 * @param params.staleness Whether to build the staleness-verifier instruction mode
 * @param params.domain Full `.sns` domain or subdomain name
 * @param params.record Record type
 * @param params.owner Current owner of the domain
 * @param params.payer Fee payer for the instruction
 * @param params.verifier Verifier account used by the record validation instruction
 * @returns Transaction instruction.
 * @throws {UnsupportedTldError} When `params.domain` is not a `.sns` domain
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
  const trimmedDomain = _parseSnsDomain(domain);

  const { pubkey, parent } = _getRecordAndParentKey({
    domain: trimmedDomain,
    record,
  });

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
