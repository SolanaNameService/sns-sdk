import { Connection, PublicKey } from "@solana/web3.js";

import { SRS_PROGRAM_ID } from "../config";
import {
  CouldNotFindSrsOwner,
  DomainDoesNotExist,
  DomainExpired,
  PdaOwnerNotAllowed,
  RecordMalformed,
} from "../error";
import {
  getSrsDomainKeySync,
  SOL_SRS_CLASS,
} from "../utils/getSrsDomainKeySync";

import type { ResolveConfig } from "./types";

const SRS_RECORD_DISCRIMINATOR = 2;
const SRS_RECORD_HEADER_LENGTH = 75;
const SRS_OWNER_TYPE_PUBKEY = 0;
const SRS_OWNER_TYPE_TOKEN = 1;

const resolveSrsPubkeyOwner = async (
  connection: Connection,
  owner: PublicKey,
  config: ResolveConfig,
): Promise<PublicKey> => {
  if (PublicKey.isOnCurve(owner)) {
    return owner;
  }

  if (config.allowPda === "any") {
    return owner;
  }

  if (config.allowPda) {
    const ownerInfo = await connection.getAccountInfo(owner);
    const isAllowed = config.programIds.some((programId) =>
      ownerInfo?.owner.equals(programId),
    );

    if (isAllowed) {
      return owner;
    }

    throw new PdaOwnerNotAllowed(
      `The Program ${ownerInfo?.owner.toBase58()} is not allowed`,
    );
  }

  throw new PdaOwnerNotAllowed();
};

const resolveSrsTokenOwner = async (
  _connection: Connection,
  _record: PublicKey,
  _mint: PublicKey,
  _config: ResolveConfig,
): Promise<PublicKey> => {
  throw new CouldNotFindSrsOwner(
    "SRS tokenized owner resolution is not yet implemented",
  );
};

/** Resolves a TLD-trimmed `.sol` domain from its canonical SRS record. */
export const resolveSol = async (
  connection: Connection,
  domain: string,
  config: ResolveConfig,
): Promise<PublicKey> => {
  const { pubkey: record } = getSrsDomainKeySync(domain);
  const recordInfo = await connection.getAccountInfo(record);

  if (!recordInfo) {
    throw new DomainDoesNotExist(`Domain ${domain} does not exist`);
  }

  const { data } = recordInfo;
  if (
    !recordInfo.owner.equals(SRS_PROGRAM_ID) ||
    data.length < SRS_RECORD_HEADER_LENGTH ||
    data[0] !== SRS_RECORD_DISCRIMINATOR
  ) {
    throw new RecordMalformed("SRS record is malformed");
  }

  const recordClass = new PublicKey(data.subarray(1, 33));
  if (!recordClass.equals(SOL_SRS_CLASS)) {
    throw new RecordMalformed("SRS record has an invalid class");
  }

  const ownerType = data[33];
  if (
    ownerType !== SRS_OWNER_TYPE_PUBKEY &&
    ownerType !== SRS_OWNER_TYPE_TOKEN
  ) {
    throw new RecordMalformed("SRS record has an invalid owner type");
  }

  const expiry = data.readBigInt64LE(67);
  if (expiry <= BigInt(Math.floor(Date.now() / 1_000))) {
    throw new DomainExpired(`Domain ${domain} has expired`);
  }

  const owner = new PublicKey(data.subarray(34, 66));
  if (ownerType === SRS_OWNER_TYPE_TOKEN) {
    return resolveSrsTokenOwner(connection, record, owner, config);
  }

  return resolveSrsPubkeyOwner(connection, owner, config);
};
